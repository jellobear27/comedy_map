import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomeMicFinder from '@/components/home/HomeMicFinder'

jest.mock('@/lib/supabase/client', () => ({
  __esModule: true,
  isSupabaseConfigured: jest.fn(),
  createClient: jest.fn(),
}))

import { isSupabaseConfigured, createClient } from '@/lib/supabase/client'

const mockIsConfigured = isSupabaseConfigured as jest.MockedFunction<typeof isSupabaseConfigured>
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

function makeSupabaseClient(data: unknown[] | null, error: { message: string } | null) {
  const order = jest.fn(() =>
    Promise.resolve({
      data,
      error,
    })
  )
  const eq = jest.fn(() => ({ order }))
  const select = jest.fn(() => ({ eq }))
  const from = jest.fn(() => ({ select }))

  const subscribe = jest.fn()
  const on = jest.fn(() => ({ subscribe }))
  const channel = jest.fn(() => ({ on }))

  return {
    from,
    channel,
    removeChannel: jest.fn(),
  }
}

const sampleMics = [
  {
    id: 'a',
    name: 'Mic Night One',
    address: '1 Main St',
    city: 'Denver',
    state: 'CO',
    day_of_week: 1,
    start_time: '20:00:00',
    is_active: true,
  },
  {
    id: 'b',
    name: 'Tuesday Laughs',
    address: '2 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    day_of_week: 2,
    start_time: '19:30:00',
    is_active: true,
  },
]

describe('HomeMicFinder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIsConfigured.mockReturnValue(false)
  })

  it('shows setup instructions when Supabase env is not configured', async () => {
    mockIsConfigured.mockReturnValue(false)

    render(<HomeMicFinder />)

    await waitFor(() => {
      expect(
        screen.getByText(/Live listings aren't connected in this environment/i)
      ).toBeInTheDocument()
    })

    expect(mockCreateClient).not.toHaveBeenCalled()
    expect(screen.queryByText(/— live data/i)).not.toBeInTheDocument()
  })

  it('loads active open mics and shows live stats', async () => {
    mockIsConfigured.mockReturnValue(true)
    const client = makeSupabaseClient(sampleMics, null)
    mockCreateClient.mockReturnValue(client as never)

    render(<HomeMicFinder />)

    const root = document.getElementById('mic-search')
    await waitFor(() => {
      expect(root).toHaveTextContent('2 open mics')
      expect(root).toHaveTextContent('2 cities')
      expect(root).toHaveTextContent('2 states')
      expect(root).toHaveTextContent('live data')
    })

    expect(client.from).toHaveBeenCalledWith('open_mics')
    const select = client.from.mock.results[0].value.select
    expect(select).toHaveBeenCalledWith(
      'id,name,address,city,state,day_of_week,start_time,is_active'
    )

    expect(screen.getByText('Mic Night One')).toBeInTheDocument()
    expect(screen.getByText('Tuesday Laughs')).toBeInTheDocument()
  })

  it('shows query error when Supabase returns an error', async () => {
    mockIsConfigured.mockReturnValue(true)
    const client = makeSupabaseClient(null, { message: 'column foo does not exist' })
    mockCreateClient.mockReturnValue(client as never)

    render(<HomeMicFinder />)

    await waitFor(() => {
      expect(
        screen.getByText(/Couldn't load open mics: column foo does not exist/i)
      ).toBeInTheDocument()
    })
  })

  it('filters preview rows when searching', async () => {
    mockIsConfigured.mockReturnValue(true)
    mockCreateClient.mockReturnValue(makeSupabaseClient(sampleMics, null) as never)

    const user = userEvent.setup()
    render(<HomeMicFinder />)

    await waitFor(() => {
      expect(screen.getByText('Tuesday Laughs')).toBeInTheDocument()
    })

    const input = screen.getByRole('textbox', {
      name: /Find open mics anywhere in the United States/i,
    })
    await user.type(input, 'Denver')

    expect(screen.getByText('Mic Night One')).toBeInTheDocument()
    expect(screen.queryByText('Tuesday Laughs')).not.toBeInTheDocument()
    expect(screen.getByText(/1 match/i)).toBeInTheDocument()
  })
})
