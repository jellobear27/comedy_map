import Link from 'next/link'
import { MapPin, ArrowRight, Zap, TrendingUp, Heart, Star, BookOpen } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Fireflies from '@/components/ui/Fireflies'
import HomeMicFinder from '@/components/home/HomeMicFinder'
import { FEATURES } from '@/config/features'

const missionShort =
  'Most comedians still piece stage time together from venue Facebook pages, uneven group feeds, and signup sites that cover one state but fall apart when you\'re on the road. Nova Acta is a nationwide map kept accurate by comics and venues who submit and refresh listings—so everyone can find stage time, grow an audience, and never miss a show.'

export default function HomePage() {
  return (
    <div className="relative">
      <Fireflies count={14} />

      {/* Hero — comedian wedge + live search */}
      <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden pb-16 pt-24">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7B2FF7]/25 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#F72585]/25 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00F5D4]/10 rounded-full blur-[150px]" />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(123,47,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(123,47,247,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7B2FF7]/10 border border-[#7B2FF7]/30 mb-6 animate-float">
              <Zap className="w-4 h-4 text-[#7B2FF7]" aria-hidden />
              <span className="text-sm font-medium text-[#7B2FF7]">
                Built for U.S. comedians · Open mics across all 50 states
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] mb-6">
              <span className="text-white">Find Open Mics.</span>{' '}
              <span className="bg-gradient-to-r from-[#7B2FF7] via-[#F72585] to-[#FF6B6B] bg-clip-text text-transparent">
                Get Stage Time.
              </span>
            </h1>

            <p className={`text-lg sm:text-xl text-[#C8C8C8] leading-relaxed max-w-2xl mx-auto ${FEATURES.submitOpenMic ? 'mb-4' : 'mb-10'}`}>
              The nationwide open mic finder for the United States—get on stage without the usual runaround through venue
              Facebook pages, buried group posts, and regional signup tools that fall apart when you cross state lines.
            </p>

            {FEATURES.submitOpenMic && (
              <div className="max-w-2xl mx-auto mb-10 space-y-4">
                <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed">
                  We don&apos;t run a central booking desk—the map stays useful when comics and venues add, host, and
                  correct listings. That&apos;s the loop.
                </p>
                <nav
                  className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                  aria-label="Listings: add, host, or update"
                >
                  <Link
                    href="/submit-open-mic#open-mic-form"
                    className="inline-flex items-center justify-center rounded-xl border border-[#00F5D4]/40 bg-[#00F5D4]/10 px-4 py-2.5 font-semibold text-[#00F5D4] hover:bg-[#00F5D4]/15 transition-colors"
                  >
                    Submit an open mic
                  </Link>
                  <Link
                    href="/submit-open-mic#start-host"
                    className="inline-flex items-center justify-center rounded-xl border border-[#7B2FF7]/35 bg-[#7B2FF7]/10 px-4 py-2.5 font-semibold text-[#C8C8C8] hover:border-[#7B2FF7]/55 hover:text-white transition-colors"
                  >
                    Start or host an open mic
                  </Link>
                  <Link
                    href="/submit-open-mic#listing-changes"
                    className="inline-flex items-center justify-center rounded-xl border border-[#F72585]/35 bg-[#F72585]/10 px-4 py-2.5 font-semibold text-[#F72585]/95 hover:bg-[#F72585]/15 transition-colors"
                  >
                    Cancel or update a listing
                  </Link>
                </nav>
              </div>
            )}
          </div>

          <HomeMicFinder />

          <p className="text-center text-sm text-[#787878] mt-8">
            Want a profile and saved spots later?{' '}
            <Link href="/signup?role=comedian" className="text-[#7B2FF7] hover:text-[#F72585] font-medium underline underline-offset-2">
              Create a free comedian account
            </Link>
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
          <div className="w-6 h-10 border-2 border-[#7B2FF7]/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-[#7B2FF7]/80 rounded-full" />
          </div>
        </div>
      </section>

      {/* Venues — secondary wedge */}
      {FEATURES.forVenues && (
        <section className="relative py-24 lg:py-28 bg-gradient-to-b from-transparent via-[#F72585]/[0.06] to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="warning" className="mb-4">
                  For venues
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
                  Fill the room —{' '}
                  <span className="bg-gradient-to-r from-[#F72585] to-[#FFB627] bg-clip-text text-transparent">
                    find hosts &amp; comics
                  </span>
                </h2>
                <p className="text-[#A0A0A0] text-lg mb-6 leading-relaxed">
                  Submit and refresh your mic like everyone else on the map—then browse hosts and reach comics already
                  searching coast to coast for stage time.
                </p>
                <Link href="/for-venues">
                  <Button variant="secondary">
                    Venue tools &amp; sign up
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
              <Card variant="glass" hover={false} className="border border-[#FFB627]/20">
                <ul className="space-y-4">
                  {[
                    'Reach comics who are actively hunting mics',
                    'Host profiles with experience signals',
                    'Grow into listings & community over time',
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-[#C8C8C8]">
                      <TrendingUp className="w-5 h-5 shrink-0 text-[#FFB627]" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Community / superfans — tertiary */}
      {FEATURES.community && (
        <section className="relative py-16 lg:py-20 border-t border-[#7B2FF7]/15">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="success" className="mb-4 inline-flex items-center gap-2">
              <Heart className="w-3 h-3" aria-hidden />
              Fans &amp; supporters
            </Badge>
            <p className="text-[#C8C8C8] leading-relaxed">
              Love standup? Browse the{' '}
              <Link href="/community" className="text-[#00F5D4] hover:underline underline-offset-2 font-medium">
                Community
              </Link>{' '}
              — including Roast Me for feedback—when you want more than listings.{' '}
              <Link href="/signup?role=superfan" className="text-[#F72585] hover:underline underline-offset-2 font-medium">
                Superfan sign up
              </Link>
              .
            </p>
          </div>
        </section>
      )}

      {/* Courses — only when enabled */}
      {FEATURES.courses && (
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F72585]/5 to-transparent" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="danger" className="mb-4">
                Courses
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Learn from the{' '}
                <span className="bg-gradient-to-r from-[#F72585] to-[#FF6B6B] bg-clip-text text-transparent">
                  Best in Comedy
                </span>
              </h2>
              <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
                Expert-led courses covering everything from joke writing to headlining your own show.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  title: 'Joke Writing Mastery',
                  instructor: 'Dave Thompson',
                  level: 'Beginner',
                  lessons: 24,
                  rating: 4.9,
                  price: 79,
                },
                {
                  title: 'Crowd Work Secrets',
                  instructor: 'Maria Santos',
                  level: 'Intermediate',
                  lessons: 18,
                  rating: 4.8,
                  price: 99,
                },
                {
                  title: 'From Open Mic to Headliner',
                  instructor: 'James Wilson',
                  level: 'Advanced',
                  lessons: 32,
                  rating: 4.9,
                  price: 149,
                },
              ].map((course) => (
                <Card key={course.title} variant="gradient">
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-[#7B2FF7]/30 to-[#F72585]/30 mb-4 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-[#F72585]/50" aria-hidden />
                  </div>
                  <Badge size="sm" className="mb-3">
                    {course.level}
                  </Badge>
                  <h3 className="text-lg font-semibold text-white mb-1">{course.title}</h3>
                  <p className="text-sm text-[#A0A0A0] mb-4">by {course.instructor}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-[#A0A0A0]">
                      <span>{course.lessons} lessons</span>
                      <span className="flex items-center gap-1 text-[#FFB627]">
                        <Star className="w-3 h-3 fill-current" aria-hidden />
                        {course.rating}
                      </span>
                    </div>
                    <span className="font-semibold text-white">${course.price}</span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/courses">
                <Button variant="secondary" size="lg">
                  Browse All Courses
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Mission — short, lower on page */}
      <section className="relative py-16 lg:py-20 bg-[#050505]/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="info" className="mb-6">
            Why we exist
          </Badge>
          <p className="text-[#C8C8C8] text-lg leading-relaxed">{missionShort}</p>
        </div>
      </section>

      {/* Proof — honest placeholder until real quotes / logos */}
      <section className="relative py-24 lg:py-28" aria-labelledby="proof-heading">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4">Social proof</Badge>
          <h2 id="proof-heading" className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Real quotes &amp; partner logos{' '}
            <span className="bg-gradient-to-r from-[#7B2FF7] to-[#00F5D4] bg-clip-text text-transparent">
              when we earn them
            </span>
          </h2>
          <Card variant="glass" hover={false} className="border border-[#7B2FF7]/20 text-left">
            <p className="text-[#C8C8C8] leading-relaxed mb-5">
              We don&apos;t use fabricated testimonials. As comics and rooms share feedback with permission—or when clubs
              want their marks here—we&apos;ll publish quotes and logos so this page matches how the product actually
              performs.
            </p>
            <p className="text-sm text-[#787878] mb-6">
              Until then, the numbers above come straight from our database. Help us grow coverage across the country or say
              hi in the community.
            </p>
            <div className="flex flex-wrap gap-4">
              {FEATURES.submitOpenMic && (
                <Link href="/submit-open-mic" className="text-[#7B2FF7] hover:text-[#F72585] font-medium">
                  Submit a mic
                </Link>
              )}
              {FEATURES.community && (
                <Link href="/community" className="text-[#00F5D4] hover:underline font-medium">
                  Community
                </Link>
              )}
              <Link href="/signup?role=comedian" className="text-[#A0A0A0] hover:text-white font-medium">
                Create account
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 lg:py-28 pb-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#7B2FF7]/15 to-transparent rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
            Need{' '}
            <span className="bg-gradient-to-r from-[#7B2FF7] via-[#F72585] to-[#FF6B6B] bg-clip-text text-transparent">
              stage time?
            </span>
          </h2>
          <p className="text-lg text-[#A0A0A0] mb-10 max-w-xl mx-auto">
            Search the directory—or help keep it current by submitting and updating mics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/open-mics">
              <Button size="lg" className="animate-glow">
                Find open mics in the U.S.
                <MapPin className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            {FEATURES.submitOpenMic && (
              <Link href="/submit-open-mic">
                <Button variant="secondary" size="lg">
                  Submit or update a mic
                </Button>
              </Link>
            )}
          </div>
          <p className="mt-8 text-sm text-[#787878]">
            Want a saved profile?{' '}
            <Link href="/signup?role=comedian" className="text-[#7B2FF7] hover:text-[#F72585] font-medium underline underline-offset-2">
              Create a comedian account
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
