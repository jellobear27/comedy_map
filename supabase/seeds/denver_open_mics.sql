-- ============================================
-- DENVER OPEN MICS SEED DATA
-- Source: colorado-comedy.com
-- ============================================

-- Insert Denver area open mics
INSERT INTO public.open_mics (name, description, address, city, state, zip_code, day_of_week, start_time, frequency, signup_type, time_per_comic, is_active, cover_charge, notes) VALUES

-- MONDAY
('Showcase of the Mondays', 'Weekly open mic comedy night on Colfax.', '1920 E Colfax Ave', 'Denver', 'CO', '80206', 1, '20:00', 'weekly', 'list', 5, true, 0, 'One of Denver''s most popular open mics. Get there early to sign up.'),

('Lion''s Lair Open Mic', 'Legendary dive bar open mic. Raw and real comedy.', '2022 E Colfax Ave', 'Denver', 'CO', '80206', 1, '21:00', 'weekly', 'list', 5, true, 0, 'Classic Colfax dive bar vibe. Anything goes.'),

('Black Shirt Brewing Open Mic', 'Brewery open mic in RiNo. Chill vibes, good beer.', '3719 Walnut St', 'Denver', 'CO', '80205', 1, '19:30', 'weekly', 'list', 5, true, 0, 'Great craft beer selection. Supportive crowd.'),

('Longtable Open Mic', 'Weekly open mic at Longtable.', '2895 Fairfax St', 'Denver', 'CO', '80207', 1, '20:00', 'weekly', 'list', 5, true, 0, NULL),

-- TUESDAY
('Comedy Works New Talent Night', 'The legendary Comedy Works hosts new talent every Tuesday. Industry showcase.', '1226 15th St', 'Denver', 'CO', '80202', 2, '20:00', 'weekly', 'list', 5, true, 12, 'Must audition to get on the list. Premier Denver venue.'),

('Scruffy Murphy''s Open Mic', 'Irish pub open mic downtown.', '2030 Larimer St', 'Denver', 'CO', '80205', 2, '20:00', 'weekly', 'list', 5, true, 0, 'Casual pub atmosphere. Mixed crowd.'),

('Taco Tuesday Comedy Night', 'Tacos and comedy. What more do you need?', '931 E 11th Ave', 'Denver', 'CO', '80218', 2, '20:00', 'weekly', 'list', 5, true, 0, 'Taco specials available. Fun casual vibe.'),

-- WEDNESDAY  
('Rise Comedy Open Mic', 'Open mic at Denver''s dedicated comedy theater.', '1260 22nd St', 'Denver', 'CO', '80205', 3, '19:30', 'weekly', 'list', 5, true, 0, 'Professional comedy theater environment. Great for working on tight sets.'),

('Raices Comedia Open Mic', 'Monthly bilingual open mic at Raices Brewing.', '2060 W Colfax Ave', 'Denver', 'CO', '80204', 3, '20:00', 'monthly', 'list', 5, true, 0, 'Last Wednesday of the month. Bilingual comedy welcome.'),

('Mutiny Comedy Open Mic', 'Open mic at the eclectic Mutiny Information Cafe.', '3483 S Broadway', 'Englewood', 'CO', '80113', 3, '20:00', 'weekly', 'list', 5, true, 0, 'Unique bookstore/cafe venue. Alternative comedy friendly.'),

('Ratio Comedy Show', 'Weekly comedy at Ratio Beerworks in RiNo.', '2920 Larimer St', 'Denver', 'CO', '80205', 3, '20:00', 'weekly', 'bucket', 5, true, 0, 'Great beer, great comedy. RiNo location.'),

-- THURSDAY
('Pallet City Open Mic', 'Weekly open mic at Monkey Barrel Bar.', '4401 Tejon St', 'Denver', 'CO', '80211', 4, '20:00', 'weekly', 'list', 5, true, 0, 'Sunnyside neighborhood. Chill bar vibes.'),

('Through The Cracks Comedy Open Mic', 'Weekly Thursday open mic.', '4401 Tejon St', 'Denver', 'CO', '80211', 4, '21:00', 'weekly', 'list', 5, true, 0, 'Late night open mic option.'),

('LEGENDS Open Mic', 'Monthly open mic on South Broadway.', '140 S Broadway', 'Denver', 'CO', '80209', 4, '20:00', 'monthly', 'list', 5, true, 5, 'Third Thursday of the month.'),

('Hai Comedy', 'Weekly show at Hai Hospitality.', '3600 W 32nd Ave', 'Denver', 'CO', '80211', 4, '19:30', 'weekly', 'list', 5, true, 15, 'Highland neighborhood. More of a showcase.'),

-- FRIDAY
('Crazy Mountain Open Mic', 'Weekly open mic at Crazy Mountain Brewery.', '1505 N Ogden St', 'Denver', 'CO', '80218', 5, '20:00', 'weekly', 'bucket', 5, true, 0, 'Brewery setting. Draw from the bucket style.'),

('Comedy Showcase', 'Weekly showcase at 3559 Larimer.', '3559 Larimer St', 'Denver', 'CO', '80205', 5, '20:00', 'weekly', 'list', 5, true, 18.50, 'More of a produced show than open mic.'),

-- SATURDAY
('City Comics', 'Monthly showcase on East Colfax.', '1331 E Colfax Ave #101', 'Denver', 'CO', '80218', 6, '20:00', 'monthly', 'list', 5, true, 5, 'First Saturday of the month.'),

('Frosted Tips Improv', 'Improv comedy show at RISE Comedy.', '1260 22nd St', 'Denver', 'CO', '80205', 6, '20:00', 'monthly', 'list', 5, true, 17, 'Second Saturday. Improv focused.'),

-- SUNDAY
('Tag You''re It Open Mic', 'Sunday open mic at RISE Comedy.', '1260 22nd St', 'Denver', 'CO', '80205', 0, '19:00', 'weekly', 'list', 5, true, 0, 'Great Sunday option. Supportive crowd.'),

('Showcase of the Mondays... On Sundays!', 'The popular Monday mic, now also on Sundays.', '8001 E Colfax Ave', 'Denver', 'CO', '80220', 0, '19:00', 'weekly', 'list', 5, true, 0, 'Same great mic, Sunday edition.'),

('Dulce Vida Open Mic', 'Bi-monthly open mic at Dulce Vida.', '1201 Cherokee St', 'Denver', 'CO', '80204', 0, '19:00', 'biweekly', 'list', 5, true, 0, 'First and third Sundays. Art district location.'),

('Uncanny Valley Clown Jam', 'Monthly clown/variety comedy at Chaos Bloom Theater.', '70 S Broadway', 'Denver', 'CO', '80209', 0, '19:00', 'monthly', 'list', 5, true, 0, 'First Sunday. Alternative/clown comedy.'),

-- BONUS: Fort Collins (nearby)
('The Fort Open Mic', 'Weekly open mic at The Comedy Fort.', '167 N College Ave', 'Fort Collins', 'CO', '80524', 1, '20:00', 'weekly', 'list', 5, true, 0, 'Fort Collins'' main comedy venue.'),

('Pick Your Poison', 'Weekly Tuesday open mic in Fort Collins.', '152 W Mountain Ave', 'Fort Collins', 'CO', '80524', 2, '20:00', 'weekly', 'list', 5, true, 0, 'Downtown Fort Collins.'),

('Slyce Open Mic', 'Weekly Wednesday open mic in Fort Collins.', '163 W Mountain Ave', 'Fort Collins', 'CO', '80524', 3, '20:00', 'weekly', 'list', 5, true, 0, 'Pizza and comedy combo.');

-- ============================================
-- DONE! 27 open mics added
-- ============================================

