/* eslint-disable */
import { useState, useRef } from "react";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: "u1", username: "sandy_explores", name: "Sandy S.", avatar: "🌿",
    tags: ["Globe Trotter", "Foodie Oracle", "Brew Connoisseur"],
    tripsCount: 34, countriesCount: 12, citiesCount: 67,
    bio: "Energy engineer by day, taco hunter by night. Colorado-based."
  },
  {
    id: "u2", username: "marco_eats", name: "Marco R.", avatar: "🍜",
    tags: ["Local Expert", "Ramen Pilgrim"],
    tripsCount: 18, countriesCount: 5, citiesCount: 28,
    bio: "I follow noodles across time zones."
  },
  {
    id: "u3", username: "priya_wanders", name: "Priya K.", avatar: "🏔",
    tags: ["Adventure Seeker", "Trail Blazer"],
    tripsCount: 52, countriesCount: 23, citiesCount: 110,
    bio: "Mountains first. Food second. Always both."
  },
  {
    id: "u7", username: "jen_sips", name: "Jen L.", avatar: "☕",
    tags: ["Coffee Pilgrim", "Brunch Queen"],
    tripsCount: 22, countriesCount: 7, citiesCount: 38,
    bio: "Cortado connoisseur. If the latte art is bad, I'm leaving."
  },
  {
    id: "u8", username: "dev_grills", name: "Dev P.", avatar: "🔥",
    tags: ["Spice Hunter", "Foodie Oracle"],
    tripsCount: 31, countriesCount: 14, citiesCount: 55,
    bio: "South Asian food is my love language. Denver transplant via Queens."
  }
];

const MOCK_ENTRIES = [
  // ── Sandy's logs (u1) ──────────────────────────────────
  {
    id: "e1", userId: "u1",
    name: "Pearl of Siam", city: "Aurora", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Thai",
    dish: "Pad See Ew", rating: 5, verdict: "must_go",
    notes: "The best Thai in Aurora, hands down. Pad See Ew has the perfect wok char. Get the Thai iced tea.",
    tags: ["thai", "aurora gem", "comfort food"]
  },
  {
    id: "e2", userId: "u1",
    name: "El Metate Taco", city: "Aurora", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Mexican",
    dish: "Al Pastor Tacos", rating: 5, verdict: "must_go",
    notes: "Legit street tacos. The al pastor is unreal — crispy edges, pineapple, perfect salsa verde. Cash only.",
    tags: ["tacos", "street food", "cash only", "aurora"]
  },
  {
    id: "e3", userId: "u1",
    name: "Sherpa House", city: "Golden", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Nepali / Tibetan",
    dish: "Momos & Chow Mein", rating: 5, verdict: "must_go",
    notes: "Steamed momos are perfect. The chow mein is legit Nepali style. Feels like home. Beautiful patio in summer.",
    tags: ["nepali", "momos", "golden", "comfort food"]
  },
  {
    id: "e4", userId: "u1",
    name: "Endless Grind Coffee", city: "Aurora", state: "CO", country: "USA",
    type: "cafe", cuisine: "Coffee",
    dish: "Cortado", rating: 4, verdict: "must_go",
    notes: "Great neighborhood spot. Solid espresso, good vibes. My go-to when I need to get out of the house.",
    tags: ["coffee", "aurora", "cozy", "work friendly"]
  },
  {
    id: "e5", userId: "u1",
    name: "Rioja", city: "Denver", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Spanish Tapas",
    dish: "Patatas Bravas", rating: 5, verdict: "must_go",
    notes: "The gambas al ajillo changed me. Ask for the back patio.",
    tags: ["date night", "tapas", "wine"]
  },
  {
    id: "e6", userId: "u1",
    name: "Avery Brewing", city: "Boulder", state: "CO", country: "USA",
    type: "brewery", cuisine: null,
    dish: "Maharaja IPA", rating: 4, verdict: "must_go",
    notes: "Massive taproom. Get the pretzel bites.",
    tags: ["brewery", "IPA", "family friendly"]
  },
  {
    id: "e7", userId: "u1",
    name: "Snooze AM Eatery", city: "Denver", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Breakfast",
    dish: "Pineapple Upside Down Pancakes", rating: 3, verdict: "skip",
    notes: "90 min wait for pancakes. Not worth it on a weekday.",
    tags: ["brunch", "overrated", "long wait"]
  },
  {
    id: "e8", userId: "u1",
    name: "Sushi Den", city: "Denver", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Japanese",
    dish: "Omakase", rating: 5, verdict: "must_go",
    notes: "Fish flown in from Japan. Worth the splurge. Sit at the bar if you can.",
    tags: ["sushi", "splurge", "date night", "omakase"]
  },
  {
    id: "e9", userId: "u1",
    name: "Rosenberg's Bagels", city: "Denver", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Deli / Bagels",
    dish: "Everything Bagel with Lox", rating: 4, verdict: "must_go",
    notes: "NYC-style bagels in Denver. Not quite the real thing but the closest you'll get out here.",
    tags: ["bagels", "brunch", "NYC vibes"]
  },
  {
    id: "e26", userId: "u1",
    name: "Clint's Bakery & Coffee House", city: "Breckenridge", state: "CO", country: "USA",
    type: "cafe", cuisine: "Bakery / Coffee",
    dish: "Cinnamon Roll & Latte", rating: 5, verdict: "must_go",
    notes: "Cozy mountain bakery with incredible pastries. The cinnamon roll is massive. Perfect stop before hitting the slopes or trails.",
    tags: ["bakery", "breckenridge", "mountain", "cozy", "pastries"]
  },
  {
    id: "e27", userId: "u1",
    name: "Outer Range Brewing", city: "Frisco", state: "CO", country: "USA",
    type: "brewery", cuisine: null,
    dish: "Hazy IPA", rating: 5, verdict: "must_go",
    notes: "Best brewery in Summit County. The hazys are phenomenal. Mountain views from the patio are unmatched. Get there early on weekends.",
    tags: ["brewery", "hazy IPA", "frisco", "mountain views", "summit county"]
  },
  // ── Marco's logs (u2) ──────────────────────────────────
  {
    id: "e10", userId: "u2",
    name: "Hop Alley", city: "Denver", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Chinese",
    dish: "Dan Dan Noodles", rating: 5, verdict: "must_go",
    notes: "Best Chinese food in Denver. Period.",
    tags: ["noodles", "spicy", "hidden gem"]
  },
  {
    id: "e11", userId: "u2",
    name: "Uncle Ramen", city: "Denver", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Japanese Ramen",
    dish: "Spicy Miso Ramen", rating: 5, verdict: "must_go",
    notes: "Rich broth, perfect egg. The spicy miso is the move. Don't sleep on the gyoza.",
    tags: ["ramen", "spicy", "japanese", "comfort food"]
  },
  {
    id: "e12", userId: "u2",
    name: "Domo", city: "Denver", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Japanese Country Food",
    dish: "Sapporo & Yakitori Combo", rating: 4, verdict: "must_go",
    notes: "Japanese country food in a garden setting. Totally unique vibe. Order the prix fixe.",
    tags: ["japanese", "garden", "unique", "date night"]
  },
  {
    id: "e13", userId: "u2",
    name: "Huckleberry Roasters", city: "Denver", state: "CO", country: "USA",
    type: "cafe", cuisine: "Coffee",
    dish: "Pourover", rating: 4, verdict: "must_go",
    notes: "Clean, bright roasts. The RiNo location has great natural light for working.",
    tags: ["coffee", "RiNo", "work friendly", "specialty"]
  },
  {
    id: "e14", userId: "u2",
    name: "Illegal Pete's", city: "Denver", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Mexican",
    dish: "Mission-Style Burrito", rating: 3, verdict: "skip",
    notes: "It's fine. Everyone hypes it but it's basically a Chipotle with more attitude.",
    tags: ["burrito", "overhyped", "casual"]
  },
  // ── Priya's logs (u3) ──────────────────────────────────
  {
    id: "e15", userId: "u3",
    name: "Ouray Brewery", city: "Ouray", state: "CO", country: "USA",
    type: "brewery", cuisine: null,
    dish: "Pale Ale", rating: 5, verdict: "must_go",
    notes: "Mountain town brewery with the best views. Kid friendly!",
    tags: ["mountain", "family", "views"]
  },
  {
    id: "e16", userId: "u3",
    name: "Yak & Yeti", city: "Arvada", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Nepali / Indian",
    dish: "Chicken Tikka Masala", rating: 4, verdict: "must_go",
    notes: "Solid Nepali-Indian spot in Arvada. The naan is fluffy and the curries are legit. Big portions.",
    tags: ["nepali", "indian", "naan", "family friendly"]
  },
  {
    id: "e17", userId: "u3",
    name: "Crested Butte Mountain Taco", city: "Crested Butte", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Mexican",
    dish: "Fish Taco", rating: 4, verdict: "must_go",
    notes: "Post-hike fish tacos at the base. Perfect after a morning on the trails.",
    tags: ["mountain", "tacos", "post-hike", "casual"]
  },
  {
    id: "e18", userId: "u3",
    name: "Celestial Seasonings", city: "Boulder", state: "CO", country: "USA",
    type: "activity", cuisine: null,
    dish: null, rating: 4, verdict: "must_go",
    notes: "Free factory tour — the mint room will blow your sinuses open. Fun and weird. Great for visitors.",
    tags: ["free", "quirky", "boulder", "family"]
  },
  // ── Jen's logs (u7) ────────────────────────────────────
  {
    id: "e19", userId: "u7",
    name: "Sweet Bloom Coffee", city: "Lakewood", state: "CO", country: "USA",
    type: "cafe", cuisine: "Coffee",
    dish: "Ethiopian Single Origin Pourover", rating: 5, verdict: "must_go",
    notes: "This is the best specialty roaster in Colorado. Their Ethiopians are next level. Tiny space, huge flavor.",
    tags: ["specialty coffee", "roaster", "lakewood", "ethiopian"]
  },
  {
    id: "e20", userId: "u7",
    name: "Denver Milk Market", city: "Denver", state: "CO", country: "USA",
    type: "activity", cuisine: null,
    dish: null, rating: 3, verdict: "skip",
    notes: "Cute concept but overpriced for what you get. Better as a photo op than a meal destination.",
    tags: ["food hall", "overpriced", "touristy"]
  },
  {
    id: "e21", userId: "u7",
    name: "Jubilee Roasting Co.", city: "Denver", state: "CO", country: "USA",
    type: "cafe", cuisine: "Coffee",
    dish: "Lavender Latte", rating: 4, verdict: "must_go",
    notes: "The lavender latte is dreamy. Great pastries too. Quiet morning vibes.",
    tags: ["coffee", "lavender", "pastries", "cozy"]
  },
  // ── Dev's logs (u8) ────────────────────────────────────
  {
    id: "e22", userId: "u8",
    name: "Himchuli", city: "Aurora", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Nepali / Indian",
    dish: "Goat Curry & Sel Roti", rating: 5, verdict: "must_go",
    notes: "Best Nepali food in Aurora. The goat curry is slow-cooked perfection. Sel roti on the side is a must.",
    tags: ["nepali", "aurora", "goat curry", "authentic"]
  },
  {
    id: "e23", userId: "u8",
    name: "Star Kitchen", city: "Denver", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Chinese Dim Sum",
    dish: "Har Gow & Siu Mai", rating: 4, verdict: "must_go",
    notes: "Cart service dim sum! Get there early on weekends or you're waiting 45 min.",
    tags: ["dim sum", "chinese", "weekend", "cart service"]
  },
  {
    id: "e24", userId: "u8",
    name: "Kathmandu Kitchen", city: "Aurora", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Nepali",
    dish: "Thukpa", rating: 4, verdict: "must_go",
    notes: "Solid thukpa and great dal bhat. No frills, just really good home-style Nepali cooking.",
    tags: ["nepali", "aurora", "thukpa", "dal bhat"]
  },
  {
    id: "e25", userId: "u8",
    name: "Taste of Thailand", city: "Aurora", state: "CO", country: "USA",
    type: "restaurant", cuisine: "Thai",
    dish: "Green Curry", rating: 3, verdict: "skip",
    notes: "Decent but Pearl of Siam is better in every way. Green curry was too sweet.",
    tags: ["thai", "aurora", "mid"]
  }
];

// ─── ACTIVITY MOCK DATA ─────────────────────────────────────────────────────
const DIFFICULTY_COLORS = { easy: "#4ade80", moderate: "#e8c84a", hard: "#fb923c", expert: "#f87171" };

const MOCK_ACTIVITIES = [
  // ── Hiking ─────────────────────────────────────────────
  {
    id: "h1", userId: "u1", category: "hiking",
    name: "St. Mary's Glacier", city: "Idaho Springs", state: "CO",
    difficulty: "moderate", distance: "3.2 mi", elevation: "10,400 ft", elevGain: "700 ft",
    kidFriendly: false,
    notes: "Short but steep. The glacier at the top is surreal. Go early — parking fills up by 9am. Bring microspikes in spring.",
    tags: ["glacier", "day hike", "I-70 corridor", "alpine"]
  },
  {
    id: "h2", userId: "u1", category: "hiking",
    name: "Hanging Lake", city: "Glenwood Springs", state: "CO",
    difficulty: "moderate", distance: "2.4 mi", elevation: "7,300 ft", elevGain: "1,000 ft",
    kidFriendly: false,
    notes: "Permit required — book weeks in advance. The turquoise water is unreal. Steep but paved switchbacks. No swimming.",
    tags: ["permit required", "waterfall", "iconic", "bucket list"]
  },
  {
    id: "h3", userId: "u1", category: "hiking",
    name: "Quandary Peak (14er)", city: "Breckenridge", state: "CO",
    difficulty: "hard", distance: "6.75 mi", elevation: "14,265 ft", elevGain: "3,450 ft",
    kidFriendly: false,
    notes: "Best beginner 14er. Start before sunrise — weather rolls in by noon. The final push is rocky but manageable. Bring layers.",
    tags: ["14er", "summit", "alpine", "bucket list"]
  },
  {
    id: "h4", userId: "u3", category: "hiking",
    name: "Maroon Bells Scenic Loop", city: "Aspen", state: "CO",
    difficulty: "easy", distance: "1.8 mi", elevation: "9,580 ft", elevGain: "200 ft",
    kidFriendly: true,
    notes: "The most photographed spot in Colorado. Flat loop around the lake — perfect for families. Take the shuttle, no private cars in summer.",
    tags: ["iconic", "family", "easy", "photography"]
  },
  {
    id: "h5", userId: "u3", category: "hiking",
    name: "Ice Lake Basin", city: "Silverton", state: "CO",
    difficulty: "hard", distance: "8.3 mi", elevation: "12,585 ft", elevGain: "2,800 ft",
    kidFriendly: false,
    notes: "The most beautiful alpine lake in Colorado. Period. Worth every step. Wildflowers in July are insane. Start at the South Mineral TH.",
    tags: ["alpine lake", "wildflowers", "silverton", "bucket list"]
  },
  {
    id: "h6", userId: "u1", category: "hiking",
    name: "Royal Arch Trail", city: "Boulder", state: "CO",
    difficulty: "moderate", distance: "3.4 mi", elevation: "6,900 ft", elevGain: "1,300 ft",
    kidFriendly: false,
    notes: "Rocky scramble at the end but the natural stone arch is so worth it. Start from Chautauqua. Great views of the Flatirons.",
    tags: ["boulder", "arch", "scramble", "flatirons"]
  },
  {
    id: "h7", userId: "u8", category: "hiking",
    name: "Cherry Creek Trail", city: "Aurora", state: "CO",
    difficulty: "easy", distance: "12 mi", elevation: "5,400 ft", elevGain: "minimal",
    kidFriendly: true,
    notes: "Paved trail from Cherry Creek Reservoir all the way to Confluence Park. Great for running, biking, or a long walk. Flat the whole way.",
    tags: ["paved", "urban trail", "aurora", "biking", "family"]
  },
  {
    id: "h8", userId: "u3", category: "hiking",
    name: "Blue Lakes Trail", city: "Ridgway", state: "CO",
    difficulty: "hard", distance: "9 mi", elevation: "12,980 ft", elevGain: "3,200 ft",
    kidFriendly: false,
    notes: "Three turquoise lakes stacked in a glacial valley under Mt. Sneffels. Jaw-dropping. The last mile to upper lake is a scramble.",
    tags: ["alpine lake", "Mt Sneffels", "scramble", "bucket list"]
  },
  // ── Kid-Friendly Activities ────────────────────────────
  {
    id: "k1", userId: "u1", category: "kids",
    name: "Denver Zoo", city: "Denver", state: "CO",
    difficulty: "easy", distance: null, elevation: null, elevGain: null,
    kidFriendly: true,
    notes: "The Toyota Elephant Passage is incredible. Bring a stroller — it's a big campus. Free days in November. Pack snacks, food inside is overpriced.",
    tags: ["zoo", "kids", "family", "stroller friendly"]
  },
  {
    id: "k2", userId: "u1", category: "kids",
    name: "Children's Museum Denver", city: "Denver", state: "CO",
    difficulty: "easy", distance: null, elevation: null, elevGain: null,
    kidFriendly: true,
    notes: "Best for ages 1-8. The outdoor adventure area is amazing. Go on a weekday morning to avoid the chaos.",
    tags: ["museum", "kids", "indoor", "rainy day"]
  },
  {
    id: "k3", userId: "u3", category: "kids",
    name: "Butterfly Pavilion", city: "Westminster", state: "CO",
    difficulty: "easy", distance: null, elevation: null, elevGain: null,
    kidFriendly: true,
    notes: "Walk through a tropical greenhouse full of butterflies. Kids can hold a tarantula (Rosie!). Great for toddlers.",
    tags: ["butterflies", "indoor", "toddler friendly", "unique"]
  },
  {
    id: "k4", userId: "u7", category: "kids",
    name: "Elitch Gardens", city: "Denver", state: "CO",
    difficulty: "easy", distance: null, elevation: null, elevGain: null,
    kidFriendly: true,
    notes: "Classic amusement park. The kiddie rides section is solid for little ones. Water park side is great in summer. Expect lines.",
    tags: ["amusement park", "water park", "summer", "family"]
  },
  {
    id: "k5", userId: "u1", category: "kids",
    name: "Denver Botanic Gardens", city: "Denver", state: "CO",
    difficulty: "easy", distance: null, elevation: null, elevGain: null,
    kidFriendly: true,
    notes: "The Mordecai Children's Garden is magical. Japanese garden is peaceful. Blossoms of Light in winter is a must. Stroller friendly.",
    tags: ["gardens", "kids", "seasonal events", "photography"]
  },
  {
    id: "k6", userId: "u8", category: "kids",
    name: "WOW! Children's Museum", city: "Lafayette", state: "CO",
    difficulty: "easy", distance: null, elevation: null, elevGain: null,
    kidFriendly: true,
    notes: "Smaller and less crowded than Denver Children's Museum. The art room and building zone are hits. Great for ages 2-7.",
    tags: ["museum", "kids", "less crowded", "art"]
  },
  // ── Scenic Drives & Overlooks ──────────────────────────
  {
    id: "s1", userId: "u1", category: "scenic",
    name: "Trail Ridge Road", city: "Estes Park", state: "CO",
    difficulty: "easy", distance: "48 mi", elevation: "12,183 ft", elevGain: null,
    kidFriendly: true,
    notes: "Highest paved road in the US. Alpine tundra at the top — feels like another planet. Open late May to October. Stop at Forest Canyon Overlook.",
    tags: ["scenic drive", "RMNP", "alpine tundra", "bucket list"]
  },
  {
    id: "s2", userId: "u3", category: "scenic",
    name: "Million Dollar Highway", city: "Ouray", state: "CO",
    difficulty: "moderate", distance: "25 mi", elevation: "11,018 ft", elevGain: null,
    kidFriendly: true,
    notes: "Ouray to Silverton — narrow, no guardrails, absolutely stunning. Not for nervous drivers. Fall colors in September are peak.",
    tags: ["scenic drive", "mountain pass", "fall colors", "dramatic"]
  },
  {
    id: "s3", userId: "u1", category: "scenic",
    name: "Garden of the Gods", city: "Colorado Springs", state: "CO",
    difficulty: "easy", distance: "varies", elevation: "6,400 ft", elevGain: null,
    kidFriendly: true,
    notes: "Free park with massive red rock formations. Drive through or hike the short loops. Sunrise is the best time — no crowds, golden light.",
    tags: ["free", "red rocks", "photography", "family", "iconic"]
  },
  {
    id: "s4", userId: "u3", category: "scenic",
    name: "Independence Pass", city: "Twin Lakes", state: "CO",
    difficulty: "easy", distance: "32 mi", elevation: "12,095 ft", elevGain: null,
    kidFriendly: true,
    notes: "The drive from Twin Lakes to Aspen is breathtaking. Continental Divide crossing. Short walk to the summit sign. Open June-October.",
    tags: ["scenic drive", "continental divide", "aspen", "alpine"]
  },
  // ── Hot Springs, Camping, Skiing, Outdoor Adventures ───
  {
    id: "o1", userId: "u1", category: "outdoor",
    name: "Strawberry Hot Springs", city: "Steamboat Springs", state: "CO",
    difficulty: "easy", distance: null, elevation: "7,500 ft", elevGain: null,
    kidFriendly: true,
    notes: "Natural hot springs tucked in the forest. Clothing optional after dark. 4WD required in winter. Reservations needed. Absolutely magical in snow.",
    tags: ["hot springs", "natural", "winter", "romantic"]
  },
  {
    id: "o2", userId: "u3", category: "outdoor",
    name: "Arkansas River Rafting", city: "Buena Vista", state: "CO",
    difficulty: "moderate", distance: null, elevation: null, elevGain: null,
    kidFriendly: false,
    notes: "Browns Canyon is the sweet spot — Class III rapids, gorgeous scenery. Book with a local outfitter. Half-day trip is perfect.",
    tags: ["rafting", "summer", "adventure", "Browns Canyon"]
  },
  {
    id: "o3", userId: "u1", category: "outdoor",
    name: "Great Sand Dunes NP", city: "Mosca", state: "CO",
    difficulty: "moderate", distance: "varies", elevation: "8,200 ft", elevGain: "700 ft",
    kidFriendly: true,
    notes: "Tallest sand dunes in North America. Kids love Medano Creek in spring. Bring sandboards. The star-gazing at night is insane — certified dark sky.",
    tags: ["national park", "sand dunes", "stargazing", "unique", "family"]
  },
  {
    id: "o4", userId: "u1", category: "outdoor",
    name: "Breckenridge Ski Resort", city: "Breckenridge", state: "CO",
    difficulty: "moderate", distance: null, elevation: "12,998 ft", elevGain: null,
    kidFriendly: true,
    notes: "Great mountain for all levels. Peak 9 for beginners, Peak 6 for powder. The town is walkable and fun after skiing. Epic Pass.",
    tags: ["skiing", "winter", "family", "town vibes"]
  },
  {
    id: "o5", userId: "u3", category: "outdoor",
    name: "Glenwood Hot Springs Pool", city: "Glenwood Springs", state: "CO",
    difficulty: "easy", distance: null, elevation: "5,700 ft", elevGain: null,
    kidFriendly: true,
    notes: "Largest hot springs pool in the world. Great for families. Pair it with the Glenwood Caverns adventure park nearby.",
    tags: ["hot springs", "pool", "family", "I-70 corridor"]
  },
  {
    id: "o6", userId: "u8", category: "outdoor",
    name: "Camping at Turquoise Lake", city: "Leadville", state: "CO",
    difficulty: "easy", distance: null, elevation: "9,800 ft", elevGain: null,
    kidFriendly: true,
    notes: "Gorgeous alpine lake near Leadville. Reserve campsites early — they sell out fast. Kayaking, fishing, and stargazing. Cold at night even in summer.",
    tags: ["camping", "lake", "alpine", "stargazing", "leadville"]
  }
];


// ─── TRAVEL DIARY MOCK DATA ─────────────────────────────────────────────────

// Discoverable users (not yet friends)
const MOCK_DISCOVER = [
  { id: "u4", username: "leo_bites", name: "Leo T.", avatar: "🌮", tags: ["Taco Tracker", "Street Food Sage"], tripsCount: 9, countriesCount: 3, citiesCount: 19, bio: "Tacos are a lifestyle, not a meal." },
  { id: "u5", username: "nina_nomad", name: "Nina W.", avatar: "✈️", tags: ["Globe Trotter", "Coffee Pilgrim"], tripsCount: 44, countriesCount: 18, citiesCount: 89, bio: "I rate airports by their espresso bars." },
  { id: "u6", username: "raj_plates", name: "Raj M.", avatar: "🍛", tags: ["Spice Hunter", "Local Expert"], tripsCount: 27, countriesCount: 8, citiesCount: 41, bio: "If it's not spicy, is it even food?" },
];

// ─── POPULAR PLACES (General / Not friends-only) ─────────────────────────────
const POPULAR_PLACES = {
  "Denver": [
    { id: "p1", name: "Union Station", type: "landmark", category: "Must Visit", rating: 4.8, reviews: 12400, desc: "Historic train station turned social hub. Great bars and restaurants inside.", city: "Denver", state: "CO" },
    { id: "p2", name: "Red Rocks Amphitheatre", type: "landmark", category: "Iconic", rating: 4.9, reviews: 34200, desc: "World-famous outdoor concert venue carved into red sandstone.", city: "Morrison", state: "CO" },
    { id: "p3", name: "Denver Art Museum", type: "museum", category: "Culture", rating: 4.6, reviews: 8900, desc: "One of the largest art museums between Chicago and LA.", city: "Denver", state: "CO" },
    { id: "p4", name: "RiNo Art District", type: "neighborhood", category: "Trending", rating: 4.7, reviews: 6200, desc: "River North arts district — murals, breweries, galleries.", city: "Denver", state: "CO" },
    { id: "p5", name: "City Park", type: "park", category: "Outdoors", rating: 4.7, reviews: 15600, desc: "Denver's largest park with a lake, zoo, and mountain views.", city: "Denver", state: "CO" },
  ],
  "Boulder": [
    { id: "p6", name: "Pearl Street Mall", type: "neighborhood", category: "Must Visit", rating: 4.7, reviews: 22100, desc: "Pedestrian mall with shops, restaurants and street performers.", city: "Boulder", state: "CO" },
    { id: "p7", name: "Chautauqua Park", type: "park", category: "Outdoors", rating: 4.8, reviews: 18300, desc: "Iconic trailhead with stunning Flatiron views.", city: "Boulder", state: "CO" },
  ],
  "Aurora": [
    { id: "p8", name: "Cherry Creek State Park", type: "park", category: "Outdoors", rating: 4.6, reviews: 9400, desc: "Large reservoir park with trails, swimming, and camping.", city: "Aurora", state: "CO" },
    { id: "p9", name: "Stanley Marketplace", type: "market", category: "Trending", rating: 4.6, reviews: 7200, desc: "Converted airport hangar with local shops, restaurants and a brewery.", city: "Aurora", state: "CO" },
  ],
  "default": [
    { id: "p10", name: "Local Farmers Market", type: "market", category: "Popular", rating: 4.5, reviews: 3200, desc: "Fresh local produce, artisan goods and food trucks.", city: "Your City", state: "" },
    { id: "p11", name: "Downtown Historic District", type: "neighborhood", category: "Culture", rating: 4.4, reviews: 5600, desc: "Walkable historic area with restaurants and independent shops.", city: "Your City", state: "" },
  ]
};

// ─── NEARBY / RECENTLY VISITED SUGGESTIONS ───────────────────────────────────



const ACTIVITY_SUGGESTIONS = {
  kids: ["Rocky Mountain National Park", "Denver Zoo", "Elitch Gardens", "Children's Museum Denver", "Butterfly Pavilion"],
  noKids: ["14er Hiking", "Craft Brewery Tour", "Red Rocks Concert", "Whitewater Rafting", "Escape Room Denver"],
  both: ["Garden of the Gods", "Mesa Verde", "Colorado River Rafting", "Maroon Bells Hike", "Black Canyon NP"]
};


// ─── PHOTO GALLERY BUTTON + FULLSCREEN ───────────────────────────────────────
function PhotoStrip({ photos }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  if (!photos || photos.length === 0) return null;

  return (
    <>
      {/* Just a button — no thumbnails */}
      <button onClick={e => { e.stopPropagation(); setCurrent(0); setOpen(true); }}
        style={{ marginTop: 10, background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
          padding: "7px 14px", fontSize: 13, color: "#555", cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 6 }}>
        🌸 Gallery
      </button>

      {/* Full screen gallery */}
      {open && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          width: "100vw", height: "100vh",
          background: "#000", zIndex: 99999,
          display: "flex", flexDirection: "column",
          margin: 0, padding: 0
        }}>

          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "20px 24px", flexShrink: 0 }}>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
              {photos.length > 1 ? `${current + 1} / ${photos.length}` : ""}
            </div>
            <button onClick={() => setOpen(false)}
              style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
                width: 38, height: 38, color: "#fff", fontSize: 20, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>

          {/* Image area */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden" }}
            onClick={() => setOpen(false)}>
            <img src={photos[current]} alt=""
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />

            {/* Left arrow — always show if not first */}
            {photos.length > 1 && current > 0 && (
              <button onClick={e => { e.stopPropagation(); setCurrent(current - 1); }}
                style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%",
                  width: 48, height: 48, color: "#fff", fontSize: 26, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            )}

            {/* Right arrow */}
            {photos.length > 1 && current < photos.length - 1 && (
              <button onClick={e => { e.stopPropagation(); setCurrent(current + 1); }}
                style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%",
                  width: 48, height: 48, color: "#fff", fontSize: 26, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
            )}
          </div>

          {/* Thumbnail strip */}
          {photos.length > 1 && (
            <div style={{ display: "flex", gap: 8, padding: "16px 24px 28px",
              overflowX: "auto", justifyContent: "center", flexShrink: 0 }}>
              {photos.map((p, i) => (
                <img key={i} src={p} alt=""
                  onClick={() => setCurrent(i)}
                  style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 6, cursor: "pointer",
                    border: `2px solid ${i === current ? "#fff" : "transparent"}`,
                    opacity: i === current ? 1 : 0.45, flexShrink: 0, transition: "all 0.15s" }} />
              ))}
            </div>
          )}

          {/* Tap outside hint */}
          <div style={{ textAlign: "center", paddingBottom: 16, color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            Tap photo to close
          </div>
        </div>
      )}
    </>
  );
}

// ─── TAG BADGE COMPONENT ─────────────────────────────────────────────────────
const TAG_COLORS = {
  "Globe Trotter": "#e8c84a",
  "Foodie Oracle": "#f4845f",
  "Brew Connoisseur": "#7ab4a6",
  "Local Expert": "#a78bfa",
  "Ramen Pilgrim": "#fb923c",
  "Adventure Seeker": "#34d399",
  "Trail Blazer": "#60a5fa",
  "Coffee Pilgrim": "#d4a574",
  "Brunch Queen": "#f9a8d4",
  "Spice Hunter": "#ef4444",
  "Taco Tracker": "#fbbf24",
  "Street Food Sage": "#fb923c",
};

function TravelerTag({ tag }) {
  const color = TAG_COLORS[tag] || "#94a3b8";
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}55`,
      borderRadius: "20px", padding: "2px 10px", fontSize: "11px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: 600, letterSpacing: "0.03em",
      whiteSpace: "nowrap"
    }}>{tag}</span>
  );
}

// ─── STAR RATING ─────────────────────────────────────────────────────────────
function StarRating({ value, onChange, size = 18 }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} onClick={() => onChange && onChange(s)}
          style={{ fontSize: size, cursor: onChange ? "pointer" : "default",
            color: s <= value ? "#e8c84a" : "#2a2a2a", transition: "color 0.15s" }}>★</span>
      ))}
    </div>
  );
}

// ─── VERDICT BADGE ───────────────────────────────────────────────────────────
function VerdictBadge({ verdict }) {
  const config = verdict === "must_go"
    ? { label: "MUST GO", bg: "#14532d", color: "#4ade80", border: "#16a34a" }
    : { label: "SKIP IT", bg: "#450a0a", color: "#f87171", border: "#dc2626" };
  return (
    <span style={{
      background: config.bg, color: config.color, border: `1px solid ${config.border}`,
      borderRadius: "4px", padding: "2px 8px", fontSize: "10px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: 700, letterSpacing: "0.08em"
    }}>{config.label}</span>
  );
}

// ─── ENTRY CARD ──────────────────────────────────────────────────────────────
function EntryCard({ entry, user, compact = false, onEdit, onTogglePrivate, isPrivate, onAddPhoto, onViewProfile }) {
  const typeIcon = { restaurant: "🍽", brewery: "🍺", activity: "🏔", cafe: "☕" }[entry.type] || "📍";
  return (
    <div style={{
      background: "#fff", border: "1px solid #efefef", borderRadius: "12px",
      padding: compact ? "14px 16px" : "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      transition: "border-color 0.2s, transform 0.2s",
      cursor: "default"
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#efefef"; e.currentTarget.style.transform = "none"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 16 }}>{typeIcon}</span>
            <a href={`https://www.google.com/maps/search/${encodeURIComponent(entry.name + ' ' + (entry.city || ''))}`}
              target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ color: "#000", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: compact ? 15 : 17, fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
              {entry.name} ↗
            </a>
            <VerdictBadge verdict={entry.verdict} />
          </div>
          <div style={{ color: "#666", fontSize: 12, marginTop: 3, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
            {entry.city}, {entry.state} · {entry.cuisine || entry.type}
          </div>
        </div>
        <StarRating value={entry.rating} size={14} />
      </div>
      {entry.dish && (
        <div style={{ marginTop: 8, color: "#e8c84a", fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
          ✦ {entry.dish}
        </div>
      )}
      {entry.notes && !compact && (
        <div style={{ marginTop: 8, color: "#999", fontSize: 13, lineHeight: 1.5, fontStyle: "italic" }}>
          "{entry.notes}"
        </div>
      )}
      {entry.privateNote && !compact && (
        <div style={{ marginTop: 8, background: "#0d1a2e", border: "1px solid #1a3a5e", borderRadius: 6, padding: "8px 12px" }}>
          <span style={{ color: "#60a5fa", fontSize: 10, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.08em" }}>🔒 PRIVATE NOTE</span>
          <div style={{ color: "#93c5fd", fontSize: 12, marginTop: 3, lineHeight: 1.5 }}>{entry.privateNote}</div>
        </div>
      )}

      {user && (
        <div onClick={ev => { ev.stopPropagation(); onViewProfile && onViewProfile(user.id); }}
          style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, borderTop: "1px solid #efefef", paddingTop: 10, cursor: "pointer" }}>
          <span style={{ fontSize: 14 }}>{user.avatar}</span>
          <span style={{ color: "#888", fontSize: 11 }}>@{user.username}</span>
          <div style={{ marginLeft: 4, display: "flex", gap: 4 }}>
            {user.tags.slice(0,1).map(t => <TravelerTag key={t} tag={t} />)}
          </div>
        </div>
      )}

      {/* Photos display */}
      {!compact && (entry.photos || []).length > 0 && (
        <PhotoStrip photos={entry.photos} />
      )}

      {/* Edit / Private / Photo buttons — only for own entries */}
      {!compact && onEdit && (
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={e => { e.stopPropagation(); onEdit(); }}
            style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8, padding: "6px 14px",
              color: "#555", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            ✏️ Edit
          </button>
          {onTogglePrivate && (
            <button onClick={e => { e.stopPropagation(); onTogglePrivate(); }}
              style={{ background: isPrivate ? "#eff6ff" : "#f8f8f8",
                border: `1px solid ${isPrivate ? "#bfdbfe" : "#efefef"}`,
                borderRadius: 8, padding: "6px 14px",
                color: isPrivate ? "#3b82f6" : "#555", fontSize: 12, cursor: "pointer" }}>
              {isPrivate ? "🔒 Private" : "🌐 Public"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ACTIVITY CARD ──────────────────────────────────────────────────────────
const CATEGORY_ICON = { hiking: "🥾", kids: "👶", scenic: "🏞", outdoor: "⛺" };
const CATEGORY_LABEL = { hiking: "HIKING", kids: "KIDS", scenic: "SCENIC DRIVE", outdoor: "ADVENTURE" };

function DifficultyBadge({ difficulty }) {
  const color = DIFFICULTY_COLORS[difficulty] || "#94a3b8";
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}55`,
      borderRadius: "4px", padding: "2px 8px", fontSize: "10px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: 700, letterSpacing: "0.08em",
      textTransform: "uppercase"
    }}>{difficulty}</span>
  );
}

function ActivityCard({ activity, user, compact = false, onEdit, onTogglePrivate, isPrivate, onAddPhoto }) {
  const icon = CATEGORY_ICON[activity.category] || "📍";
  const catLabel = CATEGORY_LABEL[activity.category] || "ACTIVITY";
  return (
    <div style={{
      background: "#fff", border: "1px solid #efefef", borderRadius: "12px",
      padding: compact ? "14px 16px" : "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      transition: "border-color 0.2s, transform 0.2s",
      cursor: "default"
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#34d39944"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.transform = "none"; }}>

      {/* Category label */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: "#34d399", fontSize: 10, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.1em" }}>
          {icon} {catLabel}
        </span>
        {activity.kidFriendly && (
          <span style={{ background: "#60a5fa22", color: "#60a5fa", border: "1px solid #60a5fa55",
            borderRadius: "4px", padding: "2px 8px", fontSize: "10px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: 600 }}>
            👶 KID FRIENDLY
          </span>
        )}
      </div>

      {/* Title + difficulty */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <a href={`https://www.google.com/maps/search/${encodeURIComponent(activity.name + ' ' + (activity.city || ''))}`}
          target="_blank" rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{ color: "#000", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: compact ? 15 : 17, fontWeight: 600, textDecoration: "none" }}
          onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
          onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
          {activity.name} ↗
        </a>
        <DifficultyBadge difficulty={activity.difficulty} />
      </div>

      <div style={{ color: "#666", fontSize: 12, marginTop: 3, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        {activity.city}, {activity.state}
      </div>

      {/* Stats row */}
      {(activity.distance || activity.elevation || activity.elevGain) && (
        <div style={{ display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" }}>
          {activity.distance && (
            <div>
              <div style={{ color: "#e8c84a", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 13, fontWeight: 600 }}>{activity.distance}</div>
              <div style={{ color: "#555", fontSize: 10, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>DISTANCE</div>
            </div>
          )}
          {activity.elevation && (
            <div>
              <div style={{ color: "#e8c84a", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 13, fontWeight: 600 }}>{activity.elevation}</div>
              <div style={{ color: "#555", fontSize: 10, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>ELEVATION</div>
            </div>
          )}
          {activity.elevGain && (
            <div>
              <div style={{ color: "#e8c84a", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 13, fontWeight: 600 }}>{activity.elevGain}</div>
              <div style={{ color: "#555", fontSize: 10, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>ELEV GAIN</div>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {activity.notes && !compact && (
        <div style={{ marginTop: 10, color: "#999", fontSize: 13, lineHeight: 1.5, fontStyle: "italic" }}>
          "{activity.notes}"
        </div>
      )}



      {/* User attribution */}
      {user && (
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, borderTop: "1px solid #efefef", paddingTop: 10 }}>
          <span style={{ fontSize: 14 }}>{user.avatar}</span>
          <span style={{ color: "#888", fontSize: 11 }}>@{user.username}</span>
          <div style={{ marginLeft: 4, display: "flex", gap: 4 }}>
            {user.tags.slice(0,1).map(t => <TravelerTag key={t} tag={t} />)}
          </div>
        </div>
      )}

      {/* Photos display */}
      {!compact && (activity.photos || []).length > 0 && (
        <PhotoStrip photos={activity.photos} />
      )}

      {/* Edit / Private / Photo — own entries only */}
      {!compact && onEdit && (
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={e => { e.stopPropagation(); onEdit(); }}
            style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8, padding: "6px 14px",
              color: "#555", fontSize: 12, cursor: "pointer" }}>
            ✏️ Edit
          </button>
          {onTogglePrivate && (
            <button onClick={e => { e.stopPropagation(); onTogglePrivate(); }}
              style={{ background: isPrivate ? "#eff6ff" : "#f8f8f8",
                border: `1px solid ${isPrivate ? "#bfdbfe" : "#efefef"}`,
                borderRadius: 8, padding: "6px 14px",
                color: isPrivate ? "#3b82f6" : "#555", fontSize: 12, cursor: "pointer" }}>
              {isPrivate ? "🔒 Private" : "🌐 Public"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ADD ENTRY MODAL ─────────────────────────────────────────────────────────
function AddEntryModal({ onClose, onSave, entries, prefill }) {
  const [form, setForm] = useState({
    name: prefill?.name || "", city: prefill?.city || "", state: prefill?.state || "", country: prefill?.country || "USA",
    type: prefill?.type || "restaurant", cuisine: prefill?.cuisine || "", dish: "",
    rating: prefill?.rating || 0, verdict: prefill?.verdict || "must_go", notes: prefill?.notes || "", privateNote: "", tags: "", isPrivate: false
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [photos, setPhotos] = useState([]);

  const KNOWN_PLACES = {
    "pearl of siam": { name: "Pearl of Siam", city: "Aurora", state: "CO", country: "USA", cuisine: "Thai", type: "restaurant" },
    "el metate": { name: "El Metate Taco", city: "Aurora", state: "CO", country: "USA", cuisine: "Mexican", type: "restaurant" },
    "el metate taco": { name: "El Metate Taco", city: "Aurora", state: "CO", country: "USA", cuisine: "Mexican", type: "restaurant" },
    "sherpa house": { name: "Sherpa House", city: "Golden", state: "CO", country: "USA", cuisine: "Nepali / Tibetan", type: "restaurant" },
    "endless grind": { name: "Endless Grind Coffee", city: "Aurora", state: "CO", country: "USA", cuisine: "Coffee", type: "cafe" },
    "endless grind coffee": { name: "Endless Grind Coffee", city: "Aurora", state: "CO", country: "USA", cuisine: "Coffee", type: "cafe" },
    "rioja": { name: "Rioja", city: "Denver", state: "CO", country: "USA", cuisine: "Spanish Tapas", type: "restaurant" },
    "hop alley": { name: "Hop Alley", city: "Denver", state: "CO", country: "USA", cuisine: "Chinese", type: "restaurant" },
    "avery brewing": { name: "Avery Brewing", city: "Boulder", state: "CO", country: "USA", cuisine: "Craft Beer", type: "brewery" },
    "snooze": { name: "Snooze AM Eatery", city: "Denver", state: "CO", country: "USA", cuisine: "Breakfast", type: "restaurant" },
    "sushi den": { name: "Sushi Den", city: "Denver", state: "CO", country: "USA", cuisine: "Japanese", type: "restaurant" },
    "uncle ramen": { name: "Uncle Ramen", city: "Denver", state: "CO", country: "USA", cuisine: "Japanese Ramen", type: "restaurant" },
    "himchuli": { name: "Himchuli", city: "Aurora", state: "CO", country: "USA", cuisine: "Nepali / Indian", type: "restaurant" },
    "yak & yeti": { name: "Yak & Yeti", city: "Arvada", state: "CO", country: "USA", cuisine: "Nepali / Indian", type: "restaurant" },
    "kathmandu kitchen": { name: "Kathmandu Kitchen", city: "Aurora", state: "CO", country: "USA", cuisine: "Nepali", type: "restaurant" },
    "sweet bloom": { name: "Sweet Bloom Coffee", city: "Lakewood", state: "CO", country: "USA", cuisine: "Coffee", type: "cafe" },
    "huckleberry roasters": { name: "Huckleberry Roasters", city: "Denver", state: "CO", country: "USA", cuisine: "Coffee", type: "cafe" },
    "rosenberg's": { name: "Rosenberg's Bagels", city: "Denver", state: "CO", country: "USA", cuisine: "Deli / Bagels", type: "restaurant" },
    "star kitchen": { name: "Star Kitchen", city: "Denver", state: "CO", country: "USA", cuisine: "Chinese Dim Sum", type: "restaurant" },
    "clint's bakery": { name: "Clint's Bakery", city: "Breckenridge", state: "CO", country: "USA", cuisine: "Bakery / Coffee", type: "cafe" },
    "outer range brewing": { name: "Outer Range Brewing", city: "Frisco", state: "CO", country: "USA", cuisine: "Craft Beer", type: "brewery" },
    "domo": { name: "Domo", city: "Denver", state: "CO", country: "USA", cuisine: "Japanese Country Food", type: "restaurant" },
  };

  const handleNameChange = (val) => {
    setForm(f => ({ ...f, name: val }));
    if (val.length >= 2) {
      const q = val.toLowerCase();
      const matches = Object.entries(KNOWN_PLACES)
        .filter(([key]) => key.includes(q))
        .map(([, place]) => place)
        .filter((v, i, arr) => arr.findIndex(x => x.name === v.name) === i)
        .slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true); // always show dropdown (has Google fallback)
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (place) => {
    setForm(f => ({ ...f, ...place }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const inp = (field, label, placeholder, type = "text") => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>
      <input type={type} value={form[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        placeholder={placeholder}
        style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
          padding: "10px 12px", color: "#000", fontSize: 14,
          marginTop: 4, boxSizing: "border-box", outline: "none" }} />
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 16, padding: "28px 28px 24px", width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#000", margin: 0, fontSize: 20, fontWeight: 700 }}>Log a Place</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>



        <div style={{ height: 1, background: "#f0f0f0", marginBottom: 20 }} />

        <div style={{ marginBottom: 14, position: "relative" }}>
          <label style={{ color: "#666", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>Place Name</label>
          <input value={form.name} onChange={e => handleNameChange(e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onFocus={() => form.name.length >= 2 && setShowSuggestions(true)}
            onKeyDown={e => e.key === "Escape" && setShowSuggestions(false)}
            placeholder="Start typing a place name..."
            style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
              padding: "11px 12px", color: "#000", fontSize: 14, marginTop: 4,
              boxSizing: "border-box", outline: "none" }} />
          {form.name.length >= 2 && showSuggestions && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff",
              border: "1px solid #efefef", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              zIndex: 10, overflow: "hidden", marginTop: 2 }}>
              {suggestions.map((s, i) => (
                <div key={i} onMouseDown={() => selectSuggestion(s)}
                  style={{ padding: "12px 14px", cursor: "pointer", borderBottom: "1px solid #f5f5f5",
                    display: "flex", alignItems: "center", gap: 10 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8f8f8"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <span style={{ fontSize: 18 }}>{{ restaurant:"🍽", brewery:"🍺", cafe:"☕", activity:"🏔" }[s.type] || "📍"}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#000" }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{s.city}, {s.state} · {s.cuisine || s.type}</div>
                  </div>
                </div>
              ))}
              {/* Google Maps fallback */}
              {form.name.length >= 2 && (
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(form.name)}`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => setShowSuggestions(false)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                    borderTop: suggestions.length > 0 ? "1px solid #f5f5f5" : "none",
                    textDecoration: "none", background: "#fafafa" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f0f0"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fafafa"}>
                  <span style={{ fontSize: 18 }}>🔍</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#000" }}>Search "{form.name}" on Google Maps</div>
                    <div style={{ fontSize: 12, color: "#888" }}>Opens Google Maps to find the place</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#aaa" }}>↗</span>
                </a>
              )}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>City</label>
            <input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))}
              style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8,
                padding: "10px 12px", color: "#f5f0e8", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }} />
          </div>
          <div>
            <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>State</label>
            <input value={form.state} onChange={e => setForm(f => ({...f, state: e.target.value}))}
              style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8,
                padding: "10px 12px", color: "#f5f0e8", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }} />
          </div>
          <div>
            <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Country</label>
            <input value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))}
              style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8,
                padding: "10px 12px", color: "#f5f0e8", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }} />
          </div>
        </div>

        <div style={{ marginTop: 14, marginBottom: 14 }}>
          <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Type</label>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            {["restaurant","brewery","cafe","hotel","activity"].map(t => (
              <button key={t} onClick={() => setForm(f => ({...f, type: t}))}
                style={{ background: form.type === t ? "#00000022" : "#f8f8f8",
                  border: `1px solid ${form.type === t ? "#000" : "#efefef"}`,
                  color: form.type === t ? "#000" : "#555",
                  borderRadius: 6, padding: "6px 12px", cursor: "pointer",
                  fontSize: 12, textTransform: "capitalize" }}>
                {{ restaurant: "🍽", brewery: "🍺", cafe: "☕", hotel: "🏨", activity: "🏔" }[t]} {t}
              </button>
            ))}
          </div>
        </div>

        {inp("cuisine", "Cuisine / Category", "e.g. Spanish Tapas, IPA Brewery")}
        {inp("dish", "Must-Try Dish or Drink", "What should everyone order?")}

        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Rating</label>
          <StarRating value={form.rating} onChange={r => setForm(f => ({...f, rating: r}))} size={24} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Verdict</label>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            {[["must_go","MUST GO","#4ade80"],["skip","SKIP IT","#f87171"]].map(([v,l,c]) => (
              <button key={v} onClick={() => setForm(f => ({...f, verdict: v}))}
                style={{ flex: 1, background: form.verdict === v ? c + "22" : "#111",
                  border: `1px solid ${form.verdict === v ? c : "#333"}`,
                  color: form.verdict === v ? c : "#666",
                  borderRadius: 6, padding: "8px", cursor: "pointer",
                  fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: 700 }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Notes</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
            placeholder="What made it special? What to avoid? Tips for others…"
            rows={3}
            style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8,
              padding: "10px 12px", color: "#f5f0e8", fontSize: 13, marginTop: 4,
              boxSizing: "border-box", outline: "none", resize: "vertical",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", lineHeight: 1.5 }} />
        </div>

        {inp("tags", "Tags", "date night, spicy, hidden gem (comma separated)")}

        {/* Photo upload */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "#666", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Photos (optional)</label>
          {photos.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              {photos.map((photo, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={photo} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1px solid #efefef" }} />
                  <button onClick={() => setPhotos(p => p.filter((_, idx) => idx !== i))}
                    style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%",
                      background: "#000", border: "none", color: "#fff", fontSize: 11, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>
          )}
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
            background: "#f8f8f8", border: "1px dashed #ddd", borderRadius: 8, padding: "10px 16px",
            fontSize: 13, color: "#555", width: "100%", justifyContent: "center" }}>
            📷 Add Photos
            <input type="file" accept="image/*" multiple style={{ display: "none" }}
              onChange={e => {
                const files = Array.from(e.target.files);
                const results = [];
                let loaded = 0;
                files.forEach((file, idx) => {
                  const reader = new FileReader();
                  reader.onload = ev => {
                    results[idx] = ev.target.result;
                    loaded++;
                    if (loaded === files.length) {
                      setPhotos(p => [...p, ...results]);
                    }
                  };
                  reader.readAsDataURL(file);
                });
              }} />
          </label>
        </div>

        <button onClick={() => {
          if (!form.name || !form.city) return;
          const newEntry = {
            ...form,
            id: "e" + Date.now(), userId: "u1",
            photos,
            tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)
          };
          onSave(newEntry);
          onClose();
        }}
          style={{ width: "100%", background: "#000",
            border: "none", borderRadius: 8, padding: "13px", color: "#fff",
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            letterSpacing: "0.02em" }}>
          Save to My Travels
        </button>
      </div>
    </div>
  );
}

// ─── TRIP PLANNER MODAL ──────────────────────────────────────────────────────
function TripPlannerModal({ entries, onClose, onSaveTrip, savedTrips, onUpdateTrip }) {
  const [mode, setMode] = useState(null); // null | "quick" | "manual" | "paste"
  const [step, setStep] = useState(0);
  // Paste notes state

  const [prefs, setPrefs] = useState({ destination: "Colorado", days: 3, kids: false, types: [], invitedFriends: [] });
  const [plan, setPlan] = useState(null);
  // Manual plan state
  const [manualDestination, setManualDestination] = useState("");
  const [manualDays, setManualDays] = useState("3");
  const [manualSections, setManualSections] = useState([{ id: "s1", name: "Day 1", notes: "", items: [] }, { id: "s2", name: "Day 2", notes: "", items: [] }, { id: "s3", name: "Day 3", notes: "", items: [] }]);
  const [manualSearch, setManualSearch] = useState("");
  const [manualNotes, setManualNotes] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState("");
  const [manualGenerated, setManualGenerated] = useState(false);

  const CITIES = [...new Set(entries.map(e => e.city))];


  const generateFromManualNotes = async () => {
    if (!manualNotes.trim()) return;
    setManualLoading(true);
    setManualError("");
    try {
      const n = parseInt(manualDays) || 3;
      const dest = manualDestination || "the destination";
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{
            role: "user",
            content: "Organize these travel notes into a " + n + "-day itinerary for " + dest + ". Notes: " + manualNotes + " Return ONLY a JSON object, no explanation, no markdown, no backticks. Format: {days:[{id:'s1',name:'Day 1',items:[{id:'i1_1',name:'Place Name',type:'restaurant',note:'short tip',city:'" + dest + "',state:'',verdict:'must_go',cuisine:''}]}]}"
          }]
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.[0]?.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.days && parsed.days.length > 0) {
        setManualSections(parsed.days);
        setManualGenerated(true);
      } else {
        throw new Error("Empty plan returned");
      }
    } catch(err) {
      setManualError("Could not generate itinerary. Try adding a destination and fewer notes, then try again.");
    }
    setManualLoading(false);
  };

  const generatePlan = () => {
    const filteredEntries = entries.filter(e =>
      e.verdict === "must_go" &&
      (prefs.types.length === 0 || prefs.types.includes(e.type))
    );
    const activities = prefs.kids ? ACTIVITY_SUGGESTIONS.kids : ACTIVITY_SUGGESTIONS.noKids;
    const planData = {
      days: Array.from({ length: prefs.days }, (_, i) => ({
        day: i + 1,
        city: CITIES[i % CITIES.length] || "Denver",
        entries: filteredEntries.slice(i * 2, i * 2 + 2),
        activity: activities[i % activities.length]
      }))
    };
    setPlan(planData);
    setStep(2);
  };

  // Manual mode helpers
  const addSection = () => setManualSections(s => [...s, { id: "s" + Date.now(), name: `Day ${s.length + 1}`, notes: "", items: [] }]);
  const addToSection = (sectionId, entry) => {
    setManualSections(s => s.map(sec => sec.id === sectionId ? { ...sec, items: [...sec.items, entry] } : sec));
  };
  const removeFromSection = (sectionId, entryId) => {
    setManualSections(s => s.map(sec => sec.id === sectionId ? { ...sec, items: sec.items.filter(e => e.id !== entryId) } : sec));
  };
  const updateSectionName = (sectionId, name) => {
    setManualSections(s => s.map(sec => sec.id === sectionId ? { ...sec, name } : sec));
  };
  const updateSectionNotes = (sectionId, notes) => {
    setManualSections(s => s.map(sec => sec.id === sectionId ? { ...sec, notes } : sec));
  };
  const deleteSection = (sectionId) => setManualSections(s => s.filter(sec => sec.id !== sectionId));

  const friendEntries = entries.filter(e => e.userId !== "u1");
  const manualSearchResults = manualSearch.trim().length >= 2
    ? friendEntries.filter(e =>
        e.name.toLowerCase().includes(manualSearch.toLowerCase()) ||
        e.city.toLowerCase().includes(manualSearch.toLowerCase()) ||
        e.state?.toLowerCase().includes(manualSearch.toLowerCase())
      ).slice(0, 8)
    : [];

  const cityKey = Object.keys(POPULAR_PLACES).find(k =>
    manualDestination.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(manualDestination.toLowerCase())
  );
  const popularForDest = manualDestination.trim()
    ? (POPULAR_PLACES[cityKey] || POPULAR_PLACES["default"])
    : [];
  const friendsForDest = manualDestination.trim()
    ? entries.filter(e =>
        e.city.toLowerCase().includes(manualDestination.toLowerCase()) ||
        e.state?.toLowerCase().includes(manualDestination.toLowerCase())
      )
    : [];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 16, padding: 24, width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#000", margin: 0, fontSize: 20, fontWeight: 700 }}>
            {!mode ? "Plan a Trip" : mode === "quick" ? (step === 2 ? "Your Trip Plan 🗺" : "Quick Plan") : "Build a Trip"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>

        {/* Mode selector */}
        {!mode && (
          <div>
            <p style={{ color: "#888", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              How do you want to plan your trip?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => setMode("quick")}
                style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 12,
                  padding: "16px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 26, flexShrink: 0 }}>⚡</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#000", marginBottom: 2 }}>Quick Plan</div>
                  <div style={{ fontSize: 13, color: "#888" }}>Auto-generate from your preferences and network picks</div>
                </div>
              </button>
              <button onClick={() => setMode("manual")}
                style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 12,
                  padding: "16px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 26, flexShrink: 0 }}>📝</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#000", marginBottom: 2 }}>Build a Trip</div>
                  <div style={{ fontSize: 13, color: "#888" }}>Paste your saved places and notes — AI organizes them, then you edit</div>
                </div>
              </button>
            </div>
          </div>
        )}


        {/* MANUAL MODE */}
        {mode === "manual" && (
          <div>
            <button onClick={() => { setMode(null); setManualGenerated(false); setManualNotes(""); setManualError(""); }}
              style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 16 }}>← Back</button>

            {/* Destination + Days */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Destination</label>
                <input value={manualDestination} onChange={e => setManualDestination(e.target.value)}
                  placeholder="e.g. Denver, Paris..."
                  style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                    padding: "11px 12px", color: "#000", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Days</label>
                <input type="number" min="1" value={manualDays} onChange={e => {
                  const n = parseInt(e.target.value) || 1;
                  setManualDays(e.target.value);
                  setManualSections(Array.from({length: n}, (_, i) => manualSections[i] || { id: "s" + (i+1), name: `Day ${i+1}`, notes: "", items: [] }));
                }}
                  placeholder="3"
                  style={{ width: 70, background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                    padding: "11px 12px", color: "#000", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            {/* Notes field + AI generate */}
            {!manualGenerated && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
                  Paste Your Notes (optional)
                </label>
                <textarea
                  value={manualNotes}
                  onChange={e => setManualNotes(e.target.value)}
                  placeholder="Paste restaurant names, places to visit, friends' suggestions, Google Maps saves... AI will organize them into your days."
                  rows={5}
                  style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                    padding: "12px", color: "#000", fontSize: 13, outline: "none",
                    resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }} />
                {manualError && (
                  <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{manualError}</div>
                )}
                {manualNotes.trim() && (
                  <button onClick={generateFromManualNotes} disabled={manualLoading}
                    style={{ marginTop: 8, width: "100%", background: manualLoading ? "#888" : "#000",
                      border: "none", borderRadius: 8, padding: "11px", color: "#fff",
                      fontSize: 14, fontWeight: 600, cursor: manualLoading ? "wait" : "pointer" }}>
                    {manualLoading ? "AI is organizing…" : "✨ Generate Days from Notes"}
                  </button>
                )}
                {!manualNotes.trim() && (
                  <button onClick={() => {
                    const n = parseInt(manualDays) || 3;
                    setManualSections(Array.from({length: n}, (_, i) => ({ id: "s" + (i+1), name: `Day ${i+1}`, notes: "", items: [] })));
                    setManualGenerated(true);
                  }}
                    style={{ marginTop: 8, width: "100%", background: "#f8f8f8", border: "1px solid #efefef",
                      borderRadius: 8, padding: "11px", color: "#555", fontSize: 14, cursor: "pointer" }}>
                    Skip — Build Manually
                  </button>
                )}
              </div>
            )}

            {manualGenerated && (
              <div style={{ marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, color: "#888" }}>✨ AI organized your notes — edit below</div>
                <button onClick={() => { setManualGenerated(false); setManualSections([{ id: "s1", name: "Day 1", items: [] }]); }}
                  style={{ background: "none", border: "none", color: "#888", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
                  Start over
                </button>
              </div>
            )}

            {/* Friends logs for destination */}
            {friendsForDest.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#888", fontWeight: 600, marginBottom: 8 }}>
                  👥 FROM YOUR NETWORK · {friendsForDest.length} places
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {friendsForDest.slice(0, 5).map(e => (
                    <div key={e.id} style={{ background: "#f8f8f8", borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16 }}>{{ restaurant:"🍽", brewery:"🍺", cafe:"☕", hotel:"🏨", activity:"🏔" }[e.type] || "📍"}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "#000" }}>{e.name}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{e.city} · {e.cuisine || e.type}</div>
                      </div>
                      <select onChange={ev => ev.target.value && addToSection(ev.target.value, e)}
                        style={{ background: "#000", color: "#fff", border: "none", borderRadius: 6, padding: "5px 8px", fontSize: 12, cursor: "pointer" }}
                        defaultValue="">
                        <option value="" disabled>+ Add</option>
                        {manualSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular for destination */}
            {popularForDest.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#888", fontWeight: 600, marginBottom: 8 }}>
                  ⭐ POPULAR SPOTS
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {popularForDest.slice(0, 3).map(p => (
                    <div key={p.id} style={{ background: "#f8f8f8", borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16 }}>📍</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "#000" }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{p.city} · {p.category}</div>
                      </div>
                      <select onChange={ev => ev.target.value && addToSection(ev.target.value, {id: p.id, name: p.name, type: "activity", city: p.city, state: p.state, verdict: "must_go", cuisine: p.category})}
                        style={{ background: "#000", color: "#fff", border: "none", borderRadius: 6, padding: "5px 8px", fontSize: 12, cursor: "pointer" }}
                        defaultValue="">
                        <option value="" disabled>+ Add</option>
                        {manualSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search friends logs + Google */}
            <div style={{ marginBottom: 16 }}>
              <input value={manualSearch} onChange={e => setManualSearch(e.target.value)}
                placeholder="🔍 Search friends' logs or any place..."
                style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                  padding: "11px 12px", color: "#000", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              {manualSearch.trim().length >= 2 && manualSearchResults.length === 0 && (
                <div style={{ marginTop: 6, fontSize: 12, color: "#888" }}>
                  No matches in your network.{" "}
                  <a href={`https://www.google.com/maps/search/${encodeURIComponent(manualSearch)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ color: "#000", fontWeight: 600, textDecoration: "underline" }}>
                    Search on Google Maps ↗
                  </a>
                </div>
              )}
              {manualSearchResults.length > 0 && (
                <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 8, marginTop: 4, overflow: "hidden" }}>
                  {manualSearchResults.map(e => (
                    <div key={e.id} style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #f5f5f5" }}>
                      <span>{{ restaurant:"🍽", brewery:"🍺", cafe:"☕", hotel:"🏨", activity:"🏔" }[e.type] || "📍"}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{e.name}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{e.city}</div>
                      </div>
                      <select onChange={ev => ev.target.value && addToSection(ev.target.value, e)}
                        style={{ background: "#000", color: "#fff", border: "none", borderRadius: 6, padding: "5px 8px", fontSize: 12, cursor: "pointer" }}
                        defaultValue="">
                        <option value="" disabled>+ Add</option>
                        {manualSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trip sections */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Your Itinerary</div>
                <button onClick={addSection}
                  style={{ background: "none", border: "1px solid #efefef", borderRadius: 6, padding: "4px 12px",
                    fontSize: 12, color: "#555", cursor: "pointer" }}>
                  + Add Section
                </button>
              </div>
              {manualSections.map(section => (
                <div key={section.id} style={{ background: "#f8f8f8", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <input value={section.name} onChange={e => updateSectionName(section.id, e.target.value)}
                      style={{ flex: 1, background: "transparent", border: "none", fontSize: 14, fontWeight: 600, color: "#000", outline: "none" }} />
                    <button onClick={() => deleteSection(section.id)}
                      style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 16 }}>×</button>
                  </div>
                  <textarea
                    value={section.notes || ""}
                    onChange={e => updateSectionNotes(section.id, e.target.value)}
                    placeholder="Add notes for this day — ideas, timing, reminders..."
                    rows={2}
                    style={{ width: "100%", background: "#fff", border: "1px solid #efefef", borderRadius: 6,
                      padding: "8px 10px", fontSize: 12, color: "#555", outline: "none", resize: "none",
                      lineHeight: 1.5, boxSizing: "border-box", marginBottom: 8 }} />
                  {section.items.length === 0 ? (
                    <div style={{ fontSize: 12, color: "#bbb", textAlign: "center", padding: "8px 0" }}>No places added yet</div>
                  ) : (
                    section.items.map((e, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < section.items.length-1 ? "1px solid #efefef" : "none" }}>
                        <span>{{ restaurant:"🍽", brewery:"🍺", cafe:"☕", hotel:"🏨", activity:"🏔" }[e.type] || "📍"}</span>
                        <span style={{ flex: 1, fontSize: 13, color: "#000" }}>{e.name}</span>
                        <button onClick={() => removeFromSection(section.id, e.id)}
                          style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 14 }}>×</button>
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>

            {!manualDestination.trim() && (
              <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 8, textAlign: "center" }}>
                Please enter a destination above first
              </div>
            )}
            <button onClick={() => {
              if (!manualDestination.trim()) return;
              const tripData = {
                id: "t" + Date.now(),
                destination: manualDestination,
                days: manualSections.length,
                kids: false,
                createdAt: new Date().toLocaleDateString(),
                invitedFriends: [],
                completed: false,
                plan: {
                  days: manualSections.map((s, i) => ({
                    day: i + 1,
                    city: manualDestination,
                    activity: s.name,
                    sectionNotes: s.notes || "",
                    entries: (s.items || []).map((item, j) => ({
                      id: item.id || ("m_" + i + "_" + j),
                      name: item.name,
                      type: item.type || "activity",
                      city: item.city || manualDestination,
                      state: item.state || "",
                      verdict: item.verdict || "must_go",
                      cuisine: item.cuisine || "",
                      notes: item.note || item.notes || ""
                    }))
                  }))
                }
              };
              onSaveTrip(tripData);
              onClose();
            }}
              style={{ width: "100%", background: manualDestination.trim() ? "#000" : "#ccc",
                border: "none", borderRadius: 8, padding: 13,
                color: "#fff", fontSize: 15, fontWeight: 700, cursor: manualDestination.trim() ? "pointer" : "not-allowed" }}>
              Save Trip ✓
            </button>
          </div>
        )}

        {mode === "quick" && step === 0 && (
          <div>
            <button onClick={() => setMode(null)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 16 }}>← Back</button>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
              Auto-generate an itinerary using Must Go picks from your network.
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Destination</label>
              <input value={prefs.destination} onChange={e => setPrefs(p => ({...p, destination: e.target.value}))}
                style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                  padding: "10px 12px", color: "#000", fontSize: 14, marginTop: 4,
                  boxSizing: "border-box", outline: "none" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Number of Days</label>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                {[1,2,3,4,5,7].map(d => (
                  <button key={d} onClick={() => setPrefs(p => ({...p, days: d}))}
                    style={{ background: prefs.days === d ? "#000" : "#f8f8f8",
                      border: `1px solid ${prefs.days === d ? "#000" : "#efefef"}`,
                      color: prefs.days === d ? "#fff" : "#555",
                      borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 13 }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Traveling with Kids?</label>
              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                {[["yes", true], ["no", false]].map(([l, v]) => (
                  <button key={l} onClick={() => setPrefs(p => ({...p, kids: v}))}
                    style={{ flex: 1, background: prefs.kids === v ? "#000" : "#f8f8f8",
                      border: `1px solid ${prefs.kids === v ? "#000" : "#efefef"}`,
                      color: prefs.kids === v ? "#fff" : "#555",
                      borderRadius: 6, padding: "8px", cursor: "pointer", fontSize: 13 }}>
                    {l === "yes" ? "👨‍👩‍👧 Yes" : "🧳 No"}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Interests (optional)</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                {["restaurant","brewery","cafe","activity"].map(t => (
                  <button key={t} onClick={() => setPrefs(p => ({...p, types: p.types.includes(t) ? p.types.filter(x=>x!==t) : [...p.types, t]}))}
                    style={{ background: prefs.types.includes(t) ? "#000" : "#f8f8f8",
                      border: `1px solid ${prefs.types.includes(t) ? "#000" : "#efefef"}`,
                      color: prefs.types.includes(t) ? "#fff" : "#555",
                      borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12 }}>
                    {{ restaurant: "🍽", brewery: "🍺", cafe: "☕", activity: "🏔" }[t]} {t}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={generatePlan}
              style={{ width: "100%", background: "#000",
                border: "none", borderRadius: 8, padding: 13, color: "#fff",
                fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Build My Itinerary →
            </button>
          </div>
        )}

        {mode === 'quick' && step === 2 && plan && (
          <div>
            {/* Summary bar */}
            <div style={{ background: "#f8f8f8", borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>BASED ON</div>
              <div style={{ fontSize: 13, color: "#000" }}>
                {prefs.days}-day {prefs.destination} · {prefs.kids ? "Family" : "Adults"} · Must-Go picks from your network
              </div>
            </div>

            {/* Day itinerary */}
            {plan.days.map(day => (
              <div key={day.day} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ background: "#000", color: "#fff", borderRadius: "50%", width: 26, height: 26,
                    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                    {day.day}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>Day {day.day} — {day.city}</div>
                </div>
                <div style={{ background: "#f8f8f8", borderRadius: 8, padding: "10px 12px", marginBottom: 6 }}>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>ACTIVITY</div>
                  <div style={{ fontSize: 13, color: "#000" }}>{day.activity}</div>
                </div>
                {day.entries.map(e => (
                  <div key={e.id} style={{ marginBottom: 6 }}>
                    <EntryCard entry={e} compact />
                  </div>
                ))}
              </div>
            ))}

            {/* Save options */}
            <div style={{ borderTop: "1px solid #efefef", paddingTop: 16, marginTop: 8 }}>
              {/* Save as new trip */}
              <button onClick={() => {
                onSaveTrip({
                  id: "t" + Date.now(),
                  destination: prefs.destination,
                  days: prefs.days,
                  kids: prefs.kids,
                  createdAt: new Date().toLocaleDateString(),
                  invitedFriends: [],
                  completed: false,
                  plan
                });
                onClose();
              }}
                style={{ width: "100%", background: "#000", border: "none", borderRadius: 8,
                  padding: 13, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
                ✓ Save as New Trip
              </button>

              {/* Add to existing trip */}
              {savedTrips && savedTrips.filter(t => !t.completed).length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Or add to an existing trip:</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {savedTrips.filter(t => !t.completed).map(t => (
                      <button key={t.id} onClick={() => {
                        const updatedDays = [
                          ...(t.plan?.days || []),
                          ...plan.days.map((d, i) => ({
                            ...d,
                            day: (t.plan?.days?.length || 0) + i + 1
                          }))
                        ];
                        onUpdateTrip({ ...t, plan: { ...t.plan, days: updatedDays }, days: updatedDays.length });
                        onClose();
                      }}
                        style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                          padding: "10px 14px", fontSize: 13, color: "#000", cursor: "pointer", textAlign: "left" }}>
                        + Add to: {t.destination} ({t.days} days)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => { setStep(0); setPlan(null); }}
                style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                  padding: 12, color: "#555", fontSize: 14, cursor: "pointer" }}>
                ← Adjust Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROFILE VIEW ────────────────────────────────────────────────────────────
function ProfileView({ user, entries, onBack, savedTrips, onAddToTrip }) {
  const userEntries = entries.filter(e => e.userId === user.id);
  const cities = [...new Set(userEntries.map(e => e.city))];
  const [selectedCity, setSelectedCity] = useState(null);
  const filteredEntries = selectedCity ? userEntries.filter(e => e.city === selectedCity) : userEntries;
  const mustGo = filteredEntries.filter(e => e.verdict === "must_go");

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 13, marginBottom: 20, padding: 0 }}>
        ← Back
      </button>
      <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ width: 56, height: 56, background: "#f0f0f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
            {user.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#000" }}>{user.name}</div>
            <div style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>@{user.username}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {user.tags.map(t => <TravelerTag key={t} tag={t} />)}
            </div>
          </div>
        </div>
<div style={{ color: "#888", fontSize: 13, marginTop: 14, lineHeight: 1.5 }}>{user.bio}</div>
        <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
          {[["Trips", user.tripsCount],["Countries", user.countriesCount],["Cities", user.citiesCount]].map(([l,v]) => (
            <div key={l}>
              <div style={{ color: "#000", fontSize: 18, fontWeight: 700 }}>{v}</div>
              <div style={{ color: "#888", fontSize: 11 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ color: "#888", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
        Cities Visited
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {selectedCity && (
          <button onClick={() => setSelectedCity(null)}
            style={{ background: "#f0f0f0", border: "1px solid #ddd", borderRadius: 6,
              padding: "5px 12px", fontSize: 12, color: "#555", cursor: "pointer" }}>
            × Clear filter
          </button>
        )}
        {cities.map(c => (
          <button key={c} onClick={() => setSelectedCity(selectedCity === c ? null : c)}
            style={{ background: selectedCity === c ? "#000" : "#f8f8f8",
              border: `1px solid ${selectedCity === c ? "#000" : "#efefef"}`,
              color: selectedCity === c ? "#fff" : "#555",
              borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>
            📍 {c}
          </button>
        ))}
      </div>

      <div style={{ color: "#888", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
        {selectedCity ? `Must-Go in ${selectedCity} (${mustGo.length})` : `Must-Go Picks (${mustGo.length})`}
      </div>


      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {mustGo.map(e => (
          <div key={e.id} style={{ position: "relative" }}>
            <EntryCard entry={e} />
            {savedTrips && savedTrips.filter(t => !t.completed).length > 0 && (
              <div style={{ position: "absolute", bottom: 12, right: 12 }}>
                <select onChange={ev => { if (ev.target.value && onAddToTrip) { onAddToTrip(ev.target.value, e); ev.target.value = ""; }}}
                  style={{ background: "#000", color: "#fff", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}
                  defaultValue="">
                  <option value="" disabled>+ Trip</option>
                  {savedTrips.filter(t => !t.completed).map(t => (
                    <option key={t.id} value={t.id}>{t.destination}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FEED TAB ─────────────────────────────────────────────────────────────────
const EXTENDED_ACTIVITY = [
  { id: "a1", userId: "u2", type: "log", entryId: "e11", timeAgo: "1h ago", text: "logged a new place" },
  { id: "a2", userId: "u7", type: "log", entryId: "e19", timeAgo: "3h ago", text: "logged a new place" },
  { id: "a3", userId: "u8", type: "verdict", entryId: "e22", timeAgo: "4h ago", text: "marked as MUST GO" },
  { id: "a4", userId: "u3", type: "log", entryId: "e16", timeAgo: "6h ago", text: "logged a new place" },
  { id: "a5", userId: "u2", type: "dish", entryId: "e10", timeAgo: "8h ago", text: "added a dish tip to" },
  { id: "a6", userId: "u7", type: "verdict", entryId: "e21", timeAgo: "1d ago", text: "marked as MUST GO" },
  { id: "a7", userId: "u8", type: "log", entryId: "e23", timeAgo: "1d ago", text: "logged a new place" },
  { id: "a8", userId: "u3", type: "trip", entryId: null, timeAgo: "1d ago", text: "planned a trip to Ouray, CO" },
  { id: "a9", userId: "u2", type: "log", entryId: "e12", timeAgo: "2d ago", text: "logged a new place" },
  { id: "a10", userId: "u8", type: "dish", entryId: "e24", timeAgo: "2d ago", text: "added a dish tip to" },
  { id: "a11", userId: "u7", type: "log", entryId: "e20", timeAgo: "3d ago", text: "logged a new place" },
  { id: "a12", userId: "u3", type: "log", entryId: "e18", timeAgo: "4d ago", text: "logged a new place" },
];

const TYPE_ICON = { restaurant: "🍽", brewery: "🍺", cafe: "☕", activity: "🏔" };
const ACTION_COLOR = { log: "#e8c84a", verdict: "#4ade80", trip: "#60a5fa", dish: "#f4845f" };

function FeedTab({ entries, friendState, pendingIncoming, setPendingIncoming, setFriendState, onViewProfile, savedTrips, onAddToTrip }) {
  const [filter, setFilter] = useState("all");
  const allUsers = [...MOCK_USERS, ...MOCK_DISCOVER];
  const friends = allUsers.filter(u => friendState[u.id] === "friend");

  const [locationSearch, setLocationSearch] = useState("");
  const allEntries = [...MOCK_ENTRIES, ...entries];

  const filtered = EXTENDED_ACTIVITY.filter(a => {
    if (filter !== "all" && a.type !== filter) return false;
    if (locationSearch.trim()) {
      const entry = allEntries.find(e => e.id === a.entryId);
      const q = locationSearch.toLowerCase().trim();
      if (!entry) return a.text?.toLowerCase().includes(q);
      return entry.city?.toLowerCase().includes(q) ||
             entry.state?.toLowerCase().includes(q) ||
             entry.country?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      {/* Pending friend requests banner */}
      {pendingIncoming.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          {pendingIncoming.map(req => {
            const user = allUsers.find(u => u.id === req.from);
            if (!user) return null;
            return (
              <div key={req.from} style={{ background: "#0f1a0f", border: "1px solid #1a3a1a", borderRadius: 12, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, background: "#1a1a1a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>
                  {user.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#4ade80", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", marginBottom: 2 }}>● FRIEND REQUEST</div>
                  <div style={{ color: "#f5f0e8", fontSize: 13 }}><span style={{ fontWeight: 600 }}>{user.name}</span> wants to connect</div>
                  <div style={{ color: "#555", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>@{user.username} · {user.citiesCount} cities</div>
                </div>
                <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                  <button onClick={() => { setFriendState(s => ({...s, [req.from]: "friend"})); setPendingIncoming(p => p.filter(r => r.from !== req.from)); }}
                    style={{ background: "#4ade8022", border: "1px solid #4ade80", color: "#4ade80", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                    Accept
                  </button>
                  <button onClick={() => setPendingIncoming(p => p.filter(r => r.from !== req.from))}
                    style={{ background: "transparent", border: "1px solid #333", color: "#555", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 13 }}>
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ color: "#555", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
          {friends.length} FRIENDS · {filtered.length} UPDATES
        </div>
      </div>

      {/* Location search */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#444", pointerEvents: "none" }}>🔍</span>
        <input
          value={locationSearch}
          onChange={e => setLocationSearch(e.target.value)}
          placeholder="Search by city or state..."
          style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 10,
            padding: "10px 12px 10px 34px", color: "#f5f0e8", fontSize: 13,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = "#e8c84a"}
          onBlur={e => e.target.style.borderColor = "#2a2a2a"}
        />
        {locationSearch && (
          <button onClick={() => setLocationSearch("")}
            style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16, padding: 0 }}>✕</button>
        )}
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, overflowX: "auto", paddingBottom: 2 }}>
        {[["all","All"],["log","New Logs"],["verdict","Must Go"],["dish","Dish Tips"],["trip","Trips"]].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)}
            style={{ background: filter === v ? "#e8c84a22" : "transparent",
              border: `1px solid ${filter === v ? "#e8c84a" : "#2a2a2a"}`,
              color: filter === v ? "#e8c84a" : "#555",
              borderRadius: 20, padding: "5px 14px", cursor: "pointer",
              fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", whiteSpace: "nowrap",
              flexShrink: 0 }}>
            {l}
          </button>
        ))}
      </div>

      {friends.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", color: "#333" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
          <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#555", fontSize: 17, marginBottom: 6 }}>No friends yet</div>
          <div style={{ color: "#444", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 12 }}>Add travelers in the Network tab to see their activity here.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filtered.map((act, idx) => {
            const user = allUsers.find(u => u.id === act.userId);
            const entry = [...MOCK_ENTRIES, ...entries].find(e => e.id === act.entryId);
            if (!user) return null;
            const accentColor = ACTION_COLOR[act.type] || "#666";
            const _isFirst = idx === 0 || filtered[idx-1]?.userId !== act.userId;

            return (
              <div key={act.id}>
                {/* Date separator - show "Today" for first item or when day changes */}
                {idx === 0 && (
                  <div style={{ color: "#333", fontSize: 10, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.1em", textAlign: "center", padding: "8px 0 12px" }}>TODAY</div>
                )}
                {act.timeAgo.includes("1d") && filtered[idx-1] && !filtered[idx-1].timeAgo.includes("1d") && (
                  <div style={{ color: "#333", fontSize: 10, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.1em", textAlign: "center", padding: "12px 0" }}>YESTERDAY</div>
                )}
                {act.timeAgo.includes("2d") && filtered[idx-1] && !filtered[idx-1].timeAgo.includes("2d") && !filtered[idx-1].timeAgo.includes("3d") && (
                  <div style={{ color: "#333", fontSize: 10, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.1em", textAlign: "center", padding: "12px 0" }}>2 DAYS AGO</div>
                )}

                <div style={{ display: "flex", gap: 12, padding: "10px 0",
                  borderBottom: idx < filtered.length - 1 ? "1px solid #141414" : "none" }}>
                  {/* Avatar + timeline line */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div
                      onClick={() => onViewProfile(user.id)}
                      style={{ width: 38, height: 38, background: "#161616", border: `2px solid ${accentColor}44`,
                        borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, cursor: "pointer", flexShrink: 0 }}>
                      {user.avatar}
                    </div>
                    {idx < filtered.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: "#1a1a1a", marginTop: 6, minHeight: 16 }} />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <span style={{ color: "#f5f0e8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                          onClick={() => onViewProfile(user.id)}>
                          @{user.username}
                        </span>
                        <span style={{ color: "#555", fontSize: 13 }}> {act.text}</span>
                      </div>
                      <span style={{ color: "#333", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", flexShrink: 0, marginLeft: 8 }}>{act.timeAgo}</span>
                    </div>

                    {/* Action type pill */}
                    <div style={{ marginTop: 4 }}>
                      <span style={{ color: accentColor, fontSize: 10, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif',",
                        background: accentColor + "15", border: `1px solid ${accentColor}33`,
                        borderRadius: 20, padding: "2px 8px" }}>
                        {{ log:"+ NEW LOG", verdict:"✓ MUST GO", dish:"🍴 DISH TIP", trip:"🗺 TRIP PLANNED" }[act.type] || act.type.toUpperCase()}
                      </span>
                    </div>

                    {/* Entry card preview */}
                    {entry && (
                      <div style={{ marginTop: 10, background: "#111", border: "1px solid #1e1e1e",
                        borderRadius: 10, padding: "11px 13px",
                        borderLeft: `3px solid ${accentColor}66` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 14 }}>{TYPE_ICON[entry.type]}</span>
                          <span style={{ color: "#f5f0e8", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 15 }}>{entry.name}</span>
                          <VerdictBadge verdict={entry.verdict} />
                        </div>
                        <div style={{ color: "#555", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", marginTop: 4 }}>
                          {entry.city}, {entry.state} · {entry.cuisine || entry.type}
                        </div>
                        {entry.dish && (
                          <div style={{ color: "#e8c84a", fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", marginTop: 6 }}>
                            ✦ {entry.dish}
                          </div>
                        )}
                        {entry.notes && (
                          <div style={{ color: "#666", fontSize: 12, marginTop: 6, fontStyle: "italic", lineHeight: 1.5 }}>
                            "{entry.notes.slice(0, 80)}{entry.notes.length > 80 ? "…" : ""}"
                          </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>

                          </div>
                          {savedTrips && savedTrips.length > 0 && (
                            <select onChange={ev => { if (ev.target.value && onAddToTrip) { onAddToTrip(ev.target.value, entry); ev.target.value = ""; }}}
                              style={{ background: "#f0f0f0", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer", color: "#555" }}
                              defaultValue="">
                              <option value="" disabled>+ Trip</option>
                              {savedTrips.filter(t => !t.completed).map(t => (
                                <option key={t.id} value={t.id}>{t.destination}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Trip activity (no entry) */}
                    {!entry && act.type === "trip" && (
                      <div style={{ marginTop: 10, background: "#0d1320", border: "1px solid #1a2a40",
                        borderRadius: 10, padding: "11px 13px", borderLeft: "3px solid #60a5fa66" }}>
                        <div style={{ color: "#60a5fa", fontSize: 13, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                          🗺 {act.text}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── NETWORK TAB ─────────────────────────────────────────────────────────────
function NetworkTab({ entries, onViewProfile, friendState, setFriendState, pendingIncoming, setPendingIncoming }) {
  const [search] = useState("");
  const [networkSection, setNetworkSection] = useState("friends"); // friends | activity | discover
  const allUsers = [...MOCK_USERS.slice(1), ...MOCK_DISCOVER];
  const friends = allUsers.filter(u => friendState[u.id] === "friend");
  const pendingOutgoing = allUsers.filter(u => friendState[u.id] === "pending");

  const searchResults = search.trim().length > 1
    ? allUsers.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const getStateBtn = (user) => {
    const state = friendState[user.id];
    if (state === "friend") return (
      <span style={{ color: "#4ade80", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11, background: "#14532d", border: "1px solid #16a34a", borderRadius: 6, padding: "4px 10px" }}>✓ Friends</span>
    );
    if (state === "pending") return (
      <button onClick={e => { e.stopPropagation(); setFriendState(s => { const n = {...s}; delete n[user.id]; return n; }); }}
        style={{ color: "#e8c84a", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11, background: "#e8c84a11", border: "1px solid #e8c84a44", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>
        Pending ✕
      </button>
    );
    return (
      <button onClick={e => { e.stopPropagation(); setFriendState(s => ({...s, [user.id]: "pending"})); }}
        style={{ color: "#f5f0e8", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11, background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>
        + Add
      </button>
    );
  };

  const UserRow = ({ user, onClick }) => {
    const userEntries = entries.filter(e => e.userId === user.id);
    const mustGo = userEntries.filter(e => e.verdict === "must_go").length;
    return (
      <div onClick={onClick}
        style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: "16px 18px", cursor: "pointer", transition: "border-color 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#e8c84a44"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 42, height: 42, background: "#1a1a1a", border: "2px solid #333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
            {user.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div>
                <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#f5f0e8", fontSize: 16 }}>{user.name}</div>
                <div style={{ color: "#555", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11 }}>@{user.username}</div>
              </div>
              <div onClick={e => e.stopPropagation()}>
                {getStateBtn(user)}
              </div>
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 }}>
              {user.tags.slice(0,2).map(t => <TravelerTag key={t} tag={t} />)}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
              <span style={{ color: "#4ade80", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11 }}>{mustGo} must-go</span>
              <span style={{ color: "#555", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11 }}>{user.citiesCount} cities</span>
              <span style={{ color: "#555", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11 }}>{user.countriesCount} countries</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Search Bar */}
      <div style={{ position: "relative", marginBottom: 18 }}>
        <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#555", fontSize: 15, pointerEvents: "none" }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or @username…"
          style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 10,
            padding: "12px 14px 12px 38px", color: "#f5f0e8", fontSize: 14,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", outline: "none", boxSizing: "border-box",
            transition: "border-color 0.2s" }}
          onFocus={e => e.target.style.borderColor = "#e8c84a"}
          onBlur={e => e.target.style.borderColor = "#2a2a2a"}
        />
        {search && (
          <button onClick={() => setSearch("")}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16 }}>
            ×
          </button>
        )}
      </div>

      {/* Search Results */}
      {search.trim().length > 1 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: "#555", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", marginBottom: 10 }}>
            {searchResults.length} RESULT{searchResults.length !== 1 ? "S" : ""} FOR "{search.toUpperCase()}"
          </div>
          {searchResults.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: "#444", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 13 }}>
              No travelers found.<br />
              <span style={{ color: "#666", fontSize: 12 }}>Try a different username.</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {searchResults.map(u => <UserRow key={u.id} user={u} onClick={() => friendState[u.id] === "friend" && onViewProfile(u.id)} />)}
            </div>
          )}
        </div>
      )}

      {/* Section Tabs */}
      {!search && (
        <>
          <div style={{ display: "flex", gap: 0, marginBottom: 18, background: "#111", borderRadius: 8, padding: 3 }}>
            {[["friends", `Friends (${friends.length})`], ["discover", "Discover"]].map(([id, label]) => (
              <button key={id} onClick={() => setNetworkSection(id)}
                style={{ flex: 1, background: networkSection === id ? "#e8c84a" : "transparent",
                  border: "none", borderRadius: 6, padding: "8px 4px", cursor: "pointer",
                  color: networkSection === id ? "#0a0a0a" : "#555",
                  fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: networkSection === id ? 700 : 400,
                  transition: "all 0.2s" }}>
                {label}
              </button>
            ))}
          </div>

          {/* FRIENDS SECTION */}
          {networkSection === "friends" && (
            <div>
              {/* Pending incoming requests */}
              {pendingIncoming.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ color: "#e8c84a", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", marginBottom: 10 }}>
                    ● {pendingIncoming.length} FRIEND REQUEST{pendingIncoming.length > 1 ? "S" : ""}
                  </div>
                  {pendingIncoming.map(req => {
                    const user = [...MOCK_USERS, ...MOCK_DISCOVER].find(u => u.id === req.from);
                    if (!user) return null;
                    return (
                      <div key={req.from} style={{ background: "#0f1a0f", border: "1px solid #1a3a1a", borderRadius: 12, padding: "14px 16px", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 38, height: 38, background: "#1a1a1a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                            {user.avatar}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: "#f5f0e8", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 15 }}>{user.name}</div>
                            <div style={{ color: "#555", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11 }}>@{user.username}</div>
                          </div>
                          <div style={{ display: "flex", gap: 7 }}>
                            <button onClick={() => {
                              setFriendState(s => ({...s, [req.from]: "friend"}));
                              setPendingIncoming(p => p.filter(r => r.from !== req.from));
                            }}
                              style={{ background: "#4ade8022", border: "1px solid #4ade80", color: "#4ade80", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                              Accept
                            </button>
                            <button onClick={() => setPendingIncoming(p => p.filter(r => r.from !== req.from))}
                              style={{ background: "transparent", border: "1px solid #333", color: "#666", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pending outgoing */}
              {pendingOutgoing.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ color: "#555", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", marginBottom: 10 }}>SENT REQUESTS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {pendingOutgoing.map(u => (
                      <div key={u.id} style={{ background: "#111", border: "1px solid #222", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18 }}>{u.avatar}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: "#f5f0e8", fontSize: 14, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>{u.name}</div>
                          <div style={{ color: "#555", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>@{u.username}</div>
                        </div>
                        <span style={{ color: "#e8c84a", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11, background: "#e8c84a11", border: "1px solid #e8c84a33", borderRadius: 6, padding: "3px 9px" }}>Pending</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ color: "#555", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", marginBottom: 10 }}>
                YOUR NETWORK · {friends.length} TRAVELERS
              </div>
              {friends.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "#444", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 13, lineHeight: 1.8 }}>
                  No friends yet.<br />
                  <span style={{ color: "#666", fontSize: 12 }}>Search for travelers or check Discover.</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {friends.map(u => <UserRow key={u.id} user={u} onClick={() => onViewProfile(u.id)} />)}
                </div>
              )}
            </div>
          )}

          {/* DISCOVER SECTION */}
          {networkSection === "discover" && (
            <div>
              <div style={{ color: "#555", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", marginBottom: 14 }}>TRAVELERS YOU MIGHT KNOW</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {MOCK_DISCOVER.filter(u => friendState[u.id] !== "friend").map(u => (
                  <UserRow key={u.id} user={u} onClick={() => {}} />
                ))}
              </div>
              <div style={{ background: "#0d1a0d", border: "1px solid #1a3a1a", borderRadius: 12, padding: "16px 18px", marginTop: 20 }}>
                <div style={{ color: "#4ade80", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11, letterSpacing: "0.08em", marginBottom: 6 }}>✦ ZERO SPONSORS</div>
                <div style={{ color: "#888", fontSize: 13, lineHeight: 1.6 }}>
                  Every recommendation comes from real people. No paid placements. No algorithmic manipulation. Just trusted taste.
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── ADD DIARY MODAL ─────────────────────────────────────────────────────────
function AddDiaryModal({ onClose, onSave, entries }) {
  const [form, setForm] = useState({
    title: "", city: "", state: "", country: "USA",
    dateFrom: "", dateTo: "",
    story: "", budget: "", tags: "",
    linkedEntries: []
  });

  const myPlaces = entries.filter(e => e.userId === "u1");
  const [showLinkPicker, setShowLinkPicker] = useState(false);

  const toggleLink = (eid) => {
    setForm(f => ({
      ...f,
      linkedEntries: f.linkedEntries.includes(eid)
        ? f.linkedEntries.filter(x => x !== eid)
        : [...f.linkedEntries, eid]
    }));
  };

  const inp = (field, label, placeholder, type = "text") => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>
      <input type={type} value={form[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        placeholder={placeholder}
        style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
          padding: "10px 12px", color: "#000", fontSize: 14,
          marginTop: 4, boxSizing: "border-box", outline: "none" }} />
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: 16, padding: "28px 28px 24px", width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ color: "#e8c84a", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", margin: 0, fontSize: 22 }}>📖 New Diary Entry</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>

        {inp("title", "Trip Title", "e.g. Summit County Weekend")}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {inp("city", "City", "Breckenridge")}
          {inp("state", "State", "CO")}
          {inp("country", "Country", "USA")}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {inp("dateFrom", "Date From", "", "date")}
          {inp("dateTo", "Date To", "", "date")}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Your Story</label>
          <textarea value={form.story} onChange={e => setForm(f => ({ ...f, story: e.target.value }))}
            placeholder="Write about your trip — what you did, what surprised you, what you'd tell a friend…"
            rows={5}
            style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8,
              padding: "10px 12px", color: "#f5f0e8", fontSize: 13, marginTop: 4,
              boxSizing: "border-box", outline: "none", resize: "vertical",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", lineHeight: 1.6 }} />
        </div>

        {inp("budget", "Budget (optional)", "e.g. $650 (lodging, food, gas)")}

        {/* Link places */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Link Places from My Logs</label>
          <button onClick={() => setShowLinkPicker(!showLinkPicker)}
            style={{ background: "#111", border: "1px solid #333", borderRadius: 8, padding: "8px 14px",
              color: "#e8c84a", fontSize: 12, cursor: "pointer", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", width: "100%" }}>
            {showLinkPicker ? "▴ Hide" : `▾ Select places (${form.linkedEntries.length} linked)`}
          </button>
          {showLinkPicker && (
            <div style={{ maxHeight: 180, overflowY: "auto", marginTop: 8, background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 8, padding: 8 }}>
              {myPlaces.map(p => {
                const linked = form.linkedEntries.includes(p.id);
                return (
                  <div key={p.id} onClick={() => toggleLink(p.id)}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", cursor: "pointer", borderRadius: 6,
                      background: linked ? "#e8c84a11" : "transparent", marginBottom: 2 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 4, border: `1px solid ${linked ? "#e8c84a" : "#333"}`,
                      background: linked ? "#e8c84a" : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, color: "#0a0a0a", flexShrink: 0 }}>{linked ? "✓" : ""}</span>
                    <span style={{ color: "#f5f0e8", fontSize: 13 }}>{p.name}</span>
                    <span style={{ color: "#555", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>{p.city}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {inp("tags", "Tags", "ski trip, date night, solo (comma separated)")}

        {/* Photos placeholder */}
        <div style={{ marginBottom: 18, background: "#111", border: "1px dashed #2a2a2a", borderRadius: 8, padding: "14px", textAlign: "center" }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>📸</div>
          <div style={{ color: "#444", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11 }}>PHOTO UPLOAD COMING SOON</div>
        </div>

        <button onClick={() => {
          if (!form.title || !form.city || !form.story) return;
          const newDiary = {
            ...form,
            id: "d" + Date.now(),
            userId: "u1",
            photos: [],
            tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)
          };
          onSave(newDiary);
          onClose();
        }}
          style={{ width: "100%", background: "linear-gradient(135deg, #e8c84a, #d4a843)",
            border: "none", borderRadius: 8, padding: "13px", color: "#0a0a0a",
            fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
          Save Diary Entry
        </button>
      </div>
    </div>
  );
}


// ─── EDIT ENTRY MODAL ────────────────────────────────────────────────────────
function EditEntryModal({ entry, onClose, onSave }) {
  const [form, setForm] = useState({
    name: entry.name || "",
    city: entry.city || "",
    state: entry.state || "",
    country: entry.country || "USA",
    type: entry.type || "restaurant",
    cuisine: entry.cuisine || "",
    dish: entry.dish || "",
    rating: entry.rating || 0,
    verdict: entry.verdict || "must_go",
    notes: entry.notes || "",
    privateNote: entry.privateNote || "",
    tags: (entry.tags || []).join(", "),
    isPrivate: entry.isPrivate || false
  });
  const [photos, setPhotos] = useState(entry.photos || []);

  const inp = (field, label, placeholder, type = "text") => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>
      <input type={type} value={form[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        placeholder={placeholder}
        style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
          padding: "10px 12px", color: "#000", fontSize: 14,
          marginTop: 4, boxSizing: "border-box", outline: "none" }} />
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 16, padding: "28px 28px 24px", width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ color: "#e8c84a", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", margin: 0, fontSize: 20, fontWeight: 700 }}>Edit Log</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>

        {inp("name", "Place Name", "e.g. Rioja")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>City</label>
            <input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))}
              style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8, padding: "10px 12px", color: "#f5f0e8", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }} />
          </div>
          <div>
            <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>State</label>
            <input value={form.state} onChange={e => setForm(f => ({...f, state: e.target.value}))}
              style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8, padding: "10px 12px", color: "#f5f0e8", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }} />
          </div>
          <div>
            <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Country</label>
            <input value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))}
              style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8, padding: "10px 12px", color: "#f5f0e8", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }} />
          </div>
        </div>

        <div style={{ marginTop: 14, marginBottom: 14 }}>
          <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Type</label>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            {["restaurant","brewery","cafe","activity"].map(t => (
              <button key={t} onClick={() => setForm(f => ({...f, type: t}))}
                style={{ background: form.type === t ? "#e8c84a22" : "#111",
                  border: `1px solid ${form.type === t ? "#e8c84a" : "#333"}`,
                  color: form.type === t ? "#e8c84a" : "#666",
                  borderRadius: 6, padding: "6px 12px", cursor: "pointer",
                  fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", textTransform: "capitalize" }}>
                {{"restaurant":"🍽","brewery":"🍺","cafe":"☕","activity":"🏔"}[t]} {t}
              </button>
            ))}
          </div>
        </div>

        {inp("cuisine", "Cuisine / Category", "e.g. Spanish Tapas")}
        {inp("dish", "Must-Try Dish", "What should everyone order?")}

        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Rating</label>
          <StarRating value={form.rating} onChange={r => setForm(f => ({...f, rating: r}))} size={24} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Verdict</label>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            {[["must_go","MUST GO","#4ade80"],["skip","SKIP IT","#f87171"]].map(([v,l,c]) => (
              <button key={v} onClick={() => setForm(f => ({...f, verdict: v}))}
                style={{ flex: 1, background: form.verdict === v ? c + "22" : "#111",
                  border: `1px solid ${form.verdict === v ? c : "#333"}`,
                  color: form.verdict === v ? c : "#666",
                  borderRadius: 6, padding: "8px", cursor: "pointer",
                  fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: 700 }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Notes</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
            placeholder="What made it special?"
            rows={3}
            style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8,
              padding: "10px 12px", color: "#f5f0e8", fontSize: 13, marginTop: 4,
              boxSizing: "border-box", outline: "none", resize: "vertical",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", lineHeight: 1.5 }} />
        </div>

        {inp("privateNote", "Private Note (only you see this)", "Parking tips, secret menu items...")}
        {inp("tags", "Tags", "date night, spicy (comma separated)")}

        {/* Photos */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "#666", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Photos</label>
          {photos.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
              {photos.map((photo, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={photo} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1px solid #efefef" }} />
                  <button onClick={() => setPhotos(p => p.filter((_, idx) => idx !== i))}
                    style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%",
                      background: "#000", border: "none", color: "#fff", fontSize: 11, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                </div>
              ))}
            </div>
          )}
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
            background: "#f8f8f8", border: "1px dashed #ddd", borderRadius: 8, padding: "10px 16px",
            fontSize: 13, color: "#555", width: "100%", justifyContent: "center" }}>
            📷 Add Photos
            <input type="file" accept="image/*" multiple style={{ display: "none" }}
              onChange={e => {
                const files = Array.from(e.target.files);
                const results = [];
                let loaded = 0;
                files.forEach((file, idx) => {
                  const reader = new FileReader();
                  reader.onload = ev => {
                    results[idx] = ev.target.result;
                    loaded++;
                    if (loaded === files.length) {
                      setPhotos(p => [...p, ...results]);
                    }
                  };
                  reader.readAsDataURL(file);
                });
              }} />
          </label>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose}
            style={{ flex: 1, background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8, padding: "12px",
              color: "#555", fontSize: 14, cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={() => {
            onSave({
              ...entry,
              ...form,
              photos,
              tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)
            });
            onClose();
          }}
            style={{ flex: 2, background: "#000",
              border: "none", borderRadius: 8, padding: "12px", color: "#fff",
              fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}



// ─── SHARED TRIP CARD ────────────────────────────────────────────────────────
function SharedTripCard({ trip, sharer, onImportToLogs }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div onClick={() => setExpanded(!expanded)} style={{ padding: "16px 18px", cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#000" }}>🗺 {trip.destination}</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 3 }}>
              {trip.days} days · Shared by {sharer?.avatar} {sharer?.name || "a friend"} · {trip.sharedAt}
            </div>
          </div>
          <span style={{ color: "#aaa", fontSize: 14, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
        </div>

        {/* Place previews */}
        {!expanded && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {(trip.plan?.days || []).flatMap(d => d.entries || []).slice(0, 4).map((e, i) => (
              <span key={i} style={{ background: "#f8f8f8", borderRadius: 20, padding: "3px 10px", fontSize: 12, color: "#555" }}>
                {e.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded itinerary */}
      {expanded && trip.plan && (
        <div onClick={e => e.stopPropagation()} style={{ borderTop: "1px solid #f5f5f5", padding: "16px 18px", background: "#fafafa" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {onImportToLogs && (
              <button onClick={() => onImportToLogs()}
                style={{ flex: 1, background: "#f0f0f0", border: "none", borderRadius: 8, padding: "10px",
                  fontSize: 13, color: "#555", cursor: "pointer" }}>
                📍 Import All
              </button>
            )}
            {(() => {
              const allPlaces = (trip.plan?.days || []).flatMap(d => d.entries || d.items || []).filter(e => e.name);
              if (allPlaces.length === 0) return null;
              const origin = encodeURIComponent(allPlaces[0].name + " " + (allPlaces[0].city || trip.destination));
              const destination = encodeURIComponent(allPlaces[allPlaces.length - 1].name + " " + (allPlaces[allPlaces.length - 1].city || trip.destination));
              const waypoints = allPlaces.slice(1, -1).map(p => encodeURIComponent(p.name + " " + (p.city || trip.destination))).join("|");
              const mapsUrl = "https://www.google.com/maps/dir/" + origin + "/" + (waypoints ? waypoints + "/" : "") + destination;
              return (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, background: "#000", border: "none", borderRadius: 8, padding: "10px",
                    fontSize: 13, color: "#fff", cursor: "pointer", textAlign: "center", textDecoration: "none",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 600 }}>
                  🗺 Open in Maps
                </a>
              );
            })()}
          </div>
          {trip.plan.days.map(day => (
            <div key={day.day} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ background: "#000", color: "#fff", borderRadius: "50%", width: 24, height: 24,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                  {day.day}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>Day {day.day} — {day.city}</div>
              </div>
              {day.activity && (
                <div style={{ background: "#fff", borderRadius: 8, padding: "8px 12px", marginBottom: 6, border: "1px solid #efefef" }}>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>ACTIVITY</div>
                  <div style={{ fontSize: 13, color: "#000" }}>{day.activity}</div>
                </div>
              )}
              {(day.entries || []).map(e => (
                <div key={e.id} style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", marginBottom: 4, border: "1px solid #efefef" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{{ restaurant:"🍽", brewery:"🍺", cafe:"☕", hotel:"🏨", activity:"🏔" }[e.type] || "📍"}</span>
                    <a href={"https://www.google.com/maps/search/" + encodeURIComponent(e.name + " " + (e.city || trip.destination || ""))}
                      target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 14, fontWeight: 500, color: "#000", flex: 1, textDecoration: "none" }}
                      onClick={ev => ev.stopPropagation()}>
                      {e.name} ↗
                    </a>
                    <button onClick={ev => { ev.stopPropagation(); onImportToLogs(e); }}
                      style={{ background: "#f0f0f0", border: "none", borderRadius: 6,
                        padding: "3px 8px", fontSize: 11, color: "#555", cursor: "pointer", flexShrink: 0 }}>
                      + Log
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>{e.city} · {e.cuisine || e.type}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TRIP CARD COMPONENT ─────────────────────────────────────────────────────
function TripCard({ trip, entries, onDelete, onComplete, past, friendState, allUsers, onInviteFriend, onAddPlaces, onImportToLogs, onImportSingle, onUpdate, onShare }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [search] = useState("");
  const [showSharePicker, setShowSharePicker] = useState(false);
  const [shareSearch, setShareSearch] = useState("");

  const addDay = () => {
    if (!onUpdate) return;
    const newDay = {
      day: trip.plan.days.length + 1,
      city: trip.destination,
      activity: `Day ${trip.plan.days.length + 1}`,
      sectionNotes: "",
      entries: []
    };
    onUpdate({ ...trip, days: trip.plan.days.length + 1, plan: { ...trip.plan, days: [...trip.plan.days, newDay] } });
  };

  const deleteDay = (dayIdx) => {
    if (!onUpdate) return;
    const newDays = trip.plan.days
      .filter((_, i) => i !== dayIdx)
      .map((d, i) => ({ ...d, day: i + 1 }));
    onUpdate({ ...trip, days: newDays.length, plan: { ...trip.plan, days: newDays } });
  };

  const removePlace = (dayIdx, entryId) => {
    if (!onUpdate) return;
    const newDays = trip.plan.days.map((d, i) =>
      i === dayIdx ? { ...d, entries: (d.entries || d.items || []).filter(e => e.id !== entryId) } : d
    );
    onUpdate({ ...trip, plan: { ...trip.plan, days: newDays } });
  };

  const movePlace = (fromDayIdx, toDayIdx, entry) => {
    if (!onUpdate || fromDayIdx === toDayIdx) return;
    const newDays = trip.plan.days.map((d, i) => {
      if (i === fromDayIdx) return { ...d, entries: (d.entries || d.items || []).filter(e => e.id !== entry.id) };
      if (i === toDayIdx) return { ...d, entries: [...(d.entries || d.items || []), entry] };
      return d;
    });
    onUpdate({ ...trip, plan: { ...trip.plan, days: newDays } });
  };

  const moveDay = (dayIdx, dir) => {
    if (!onUpdate) return;
    const days = [...trip.plan.days];
    const target = dayIdx + dir;
    if (target < 0 || target >= days.length) return;
    [days[dayIdx], days[target]] = [days[target], days[dayIdx]];
    const renumbered = days.map((d, i) => ({ ...d, day: i + 1 }));
    onUpdate({ ...trip, plan: { ...trip.plan, days: renumbered } });
  };

  const allEntries = entries ? entries.filter(e => e.userId !== "u1" || e.isActivity) : [];


  return (
    <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div onClick={() => setExpanded(!expanded)} style={{ padding: "16px 18px", cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#000" }}>🗺 {trip.destination}</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 3 }}>
              {trip.days} days · {trip.kids ? "Family" : "Adults"} · {trip.createdAt}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>

            {!past && onComplete && (
              <button onClick={e => { e.stopPropagation(); onComplete(); }}
                style={{ background: "#f0f0f0", border: "none", borderRadius: 6, padding: "5px 10px",
                  fontSize: 11, color: "#555", cursor: "pointer" }}>
                ✓ Done
              </button>
            )}

            {!past && onUpdate && (
              <button onClick={e => { e.stopPropagation(); setEditing(!editing); setExpanded(true); }}
                style={{ background: editing ? "#000" : "#f0f0f0", border: "none", borderRadius: 6, padding: "5px 10px",
                  fontSize: 11, color: editing ? "#fff" : "#555", cursor: "pointer" }}>
                ✏️ Edit
              </button>
            )}
            {onShare && (
              <button onClick={e => { e.stopPropagation(); setShowSharePicker(!showSharePicker); setExpanded(true); }}
                style={{ background: showSharePicker ? "#000" : "#f0f0f0", border: "none", borderRadius: 6, padding: "5px 10px",
                  fontSize: 11, color: showSharePicker ? "#fff" : "#555", cursor: "pointer" }}>
                {past ? "🔗 Share" : "👥 Invite"}
              </button>
            )}
            <button onClick={e => { e.stopPropagation(); onDelete(); }}
              style={{ background: "transparent", border: "1px solid #efefef", borderRadius: 6, padding: "5px 10px",
                fontSize: 11, color: "#aaa", cursor: "pointer" }}>
              Delete
            </button>
            <span style={{ color: "#aaa", fontSize: 14, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
          </div>
        </div>

        {/* Invited & Shared friends */}
        {((trip.invitedFriends && trip.invitedFriends.length > 0) || (trip.sharedWithList && trip.sharedWithList.length > 0) || trip.sharedWith) && (
          <div style={{ marginTop: 10 }}>
            {trip.invitedFriends && trip.invitedFriends.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>{past ? "👥 TRAVELED WITH" : "👥 PLANNING WITH"}</span>
                {trip.invitedFriends.map(uid => {
                  const u = (allUsers || []).find(x => x.id === uid);
                  if (!u) return null;
                  return (
                    <span key={uid} style={{ background: past ? "#f0fdf4" : "#f0f7ff", border: `1px solid ${past ? "#bbf7d0" : "#dbeafe"}`, borderRadius: 20,
                      padding: "2px 10px", fontSize: 12, color: past ? "#16a34a" : "#3b82f6" }}>
                      {u.avatar} {u.name.split(" ")[0]}
                    </span>
                  );
                })}
              </div>
            )}
            {(trip.sharedWith || trip.sharedWithList) && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>🔗 SHARED WITH</span>
                {(trip.sharedWithList || (trip.sharedWith ? [trip.sharedWith] : [])).map(uid => {
                  const u = (allUsers || []).find(x => x.id === uid);
                  return u ? (
                    <span key={uid} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20,
                      padding: "2px 10px", fontSize: 12, color: "#16a34a" }}>
                      {u.avatar} {u.name.split(" ")[0]}
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        )}
        {trip.invitedFriends && trip.invitedFriends.length > 0 && false && (
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            {trip.invitedFriends.map(uid => {
              const u = allUsers.find(x => x.id === uid);
              if (!u) return null;
              return (
                <span key={uid} style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 20,
                  padding: "3px 10px", fontSize: 12, color: "#555" }}>
                  {u.avatar} {u.name.split(" ")[0]}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Expanded itinerary */}


      {expanded && trip.plan && (
        <div onClick={e => e.stopPropagation()} style={{ borderTop: "1px solid #f5f5f5", padding: "16px 18px", background: "#fafafa" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {onImportToLogs && (
              <button onClick={() => onImportToLogs()}
                style={{ flex: 1, background: "#f0f0f0", border: "none", borderRadius: 8, padding: "10px",
                  fontSize: 13, color: "#555", cursor: "pointer" }}>
                📍 Import All
              </button>
            )}
            {(() => {
              const allPlaces = (trip.plan?.days || []).flatMap(d => d.entries || d.items || []).filter(e => e.name);
              if (allPlaces.length === 0) return null;
              const origin = encodeURIComponent(allPlaces[0].name + " " + (allPlaces[0].city || trip.destination));
              const destination = encodeURIComponent(allPlaces[allPlaces.length - 1].name + " " + (allPlaces[allPlaces.length - 1].city || trip.destination));
              const waypoints = allPlaces.slice(1, -1).map(p => encodeURIComponent(p.name + " " + (p.city || trip.destination))).join("|");
              const mapsUrl = "https://www.google.com/maps/dir/" + origin + "/" + (waypoints ? waypoints + "/" : "") + destination;
              return (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, background: "#000", border: "none", borderRadius: 8, padding: "10px",
                    fontSize: 13, color: "#fff", cursor: "pointer", textAlign: "center", textDecoration: "none",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 600 }}>
                  🗺 Open in Maps
                </a>
              );
            })()}
          </div>
          {/* Share picker */}
          {showSharePicker && (
            <div style={{ marginBottom: 16, background: "#f8f8f8", borderRadius: 10, padding: "14px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 10 }}>{past ? "Share trip with..." : "Invite to edit trip..."}</div>
              <input
                value={shareSearch}
                onChange={e => setShareSearch(e.target.value)}
                placeholder="🔍 Search friends..."
                style={{ width: "100%", background: "#fff", border: "1px solid #efefef", borderRadius: 8,
                  padding: "8px 12px", fontSize: 13, color: "#000", outline: "none",
                  boxSizing: "border-box", marginBottom: 10 }}
              />
              {(allUsers || []).filter(u => friendState && friendState[u.id] === "friend"
                && (shareSearch.trim() === "" || u.name.toLowerCase().includes(shareSearch.toLowerCase()))).length === 0 ? (
                <div style={{ fontSize: 13, color: "#aaa" }}>No friends found.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 200, overflowY: "auto" }}>
                  {(allUsers || []).filter(u => friendState && friendState[u.id] === "friend"
                    && (shareSearch.trim() === "" || u.name.toLowerCase().includes(shareSearch.toLowerCase()))).map(u => (
                    <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{u.avatar}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#000" }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>@{u.username}</div>
                      </div>
                      <button onClick={() => { if (!past && onInviteFriend) { onInviteFriend(u.id); } else { onShare(u.id, u.name); } setShowSharePicker(false); setShareSearch(""); }}
                        style={{ background: "#000", border: "none", borderRadius: 8, padding: "6px 14px",
                          color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        Share
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search to add places when editing */}
          {editing && (
            <div style={{ marginBottom: 16, background: "#f0f0f0", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                🔍 <strong>Add places</strong> — Google Places search coming soon. For now, remove unwanted places using the Remove button on each entry.
              </div>
            </div>
          )}

          {trip.plan.days.map((day, dayIdx) => (
            <div key={day.day} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ background: "#000", color: "#fff", borderRadius: "50%", width: 24, height: 24,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                  {day.day}
                </div>
                {editing ? (
                  <>
                    <input
                      value={day.activity || ""}
                      onChange={e => {
                        if (!onUpdate) return;
                        const newDays = trip.plan.days.map((d, i) => i === dayIdx ? { ...d, activity: e.target.value } : d);
                        onUpdate({ ...trip, plan: { ...trip.plan, days: newDays } });
                      }}
                      placeholder="Day title..."
                      style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#000", border: "none",
                        borderBottom: "1px solid #ddd", outline: "none", background: "transparent", padding: "2px 4px" }}
                    />
                    <button onClick={() => moveDay(dayIdx, -1)} disabled={dayIdx === 0}
                      style={{ background: "none", border: "none", color: dayIdx === 0 ? "#ddd" : "#888", cursor: "pointer", fontSize: 14, padding: "0 2px" }}>↑</button>
                    <button onClick={() => moveDay(dayIdx, 1)} disabled={dayIdx === trip.plan.days.length - 1}
                      style={{ background: "none", border: "none", color: dayIdx === trip.plan.days.length - 1 ? "#ddd" : "#888", cursor: "pointer", fontSize: 14, padding: "0 2px" }}>↓</button>
                    <button onClick={() => removeDay(dayIdx)}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 13, padding: "0 2px" }}>✕</button>
                  </>
                ) : (
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>{day.activity && day.activity !== `Day ${day.day}` ? `Day ${day.day} — ${day.activity}` : `Day ${day.day}`}{!day.activity && day.city ? ` — ${day.city}` : ""}</div>
                )}
                {editing && (
                  <button onClick={() => deleteDay(dayIdx)}
                    style={{ background: "#fee2e2", border: "none", borderRadius: 6, padding: "3px 8px",
                      fontSize: 11, color: "#ef4444", cursor: "pointer", flexShrink: 0 }}>
                    Delete Day
                  </button>
                )}
              </div>
              {editing ? (
                <textarea
                  value={day.sectionNotes || ""}
                  onChange={e => {
                    if (!onUpdate) return;
                    const newDays = trip.plan.days.map((d, i) => i === dayIdx ? { ...d, sectionNotes: e.target.value } : d);
                    onUpdate({ ...trip, plan: { ...trip.plan, days: newDays } });
                  }}
                  placeholder="Add notes for this day..."
                  rows={2}
                  style={{ width: "100%", fontSize: 12, color: "#555", border: "1px solid #efefef",
                    borderRadius: 6, padding: "6px 10px", marginBottom: 8, resize: "none",
                    outline: "none", boxSizing: "border-box", lineHeight: 1.5 }}
                />
              ) : (
                day.sectionNotes && (
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 8, padding: "6px 10px",
                    background: "#fff", borderRadius: 6, border: "1px solid #efefef", lineHeight: 1.5 }}>
                    {day.sectionNotes}
                  </div>
                )
              )}
              {/* Hotel stays */}
              {(day.entries || day.items || []).filter(e => e.type === "hotel").length > 0 && (
                <div style={{ background: "#f0f7ff", border: "1px solid #dbeafe", borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
                  <div style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600, marginBottom: 4 }}>🏨 STAYING AT</div>
                  {(day.entries || day.items || []).filter(e => e.type === "hotel").map(e => (
                    <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#000", flex: 1 }}>{e.name}</span>
                      {editing && (
                        <button onClick={ev => { ev.stopPropagation(); removePlace(dayIdx, e.id); }}
                          style={{ background: "#fee2e2", border: "none", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#ef4444", cursor: "pointer" }}>
                          Remove
                        </button>
                      )}
                      {!editing && onImportToLogs && (
                        <button onClick={ev => { ev.stopPropagation(); onImportSingle({ ...e, id: "imp_" + e.id + "_" + Date.now(), userId: "u1", type: "hotel" }); }}
                          style={{ background: "#f0f0f0", border: "none", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#555", cursor: "pointer" }}>
                          + Log
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {(day.entries || day.items || []).filter(e => e.type !== "hotel").map(e => (
                <div key={e.id} style={{ background: "#fff", borderRadius: 8, padding: "10px 12px", marginBottom: 4, border: "1px solid #efefef" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{{ restaurant: "🍽", brewery: "🍺", cafe: "☕", hotel: "🏨", activity: "🏔", hiking: "🥾" }[e.type] || "📍"}</span>
                    <a href={"https://www.google.com/maps/search/" + encodeURIComponent(e.name + " " + (e.city || trip.destination || ""))}
                      target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 14, fontWeight: 500, color: "#000", flex: 1, textDecoration: "none" }}
                      onClick={ev => ev.stopPropagation()}>
                      {e.name} ↗
                    </a>
                    {editing && (
                      <div style={{ display: "flex", gap: 4, flexShrink: 0 }} onClick={ev => ev.stopPropagation()}>
                        {trip.plan.days.length > 1 && (
                          <select
                            defaultValue=""
                            onChange={ev => {
                              if (ev.target.value !== "") {
                                movePlace(dayIdx, parseInt(ev.target.value), e);
                                ev.target.value = "";
                              }
                            }}
                            style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 6,
                              padding: "3px 8px", fontSize: 11, color: "#555", cursor: "pointer", outline: "none" }}>
                            <option value="" disabled>Move to...</option>
                            {trip.plan.days.map((d, i) => i !== dayIdx && (
                              <option key={i} value={i}>Day {d.day}</option>
                            ))}
                          </select>
                        )}
                        <button onClick={ev => { ev.stopPropagation(); removePlace(dayIdx, e.id); }}
                          style={{ background: "#fee2e2", border: "none", borderRadius: 6,
                            padding: "3px 8px", fontSize: 11, color: "#ef4444", cursor: "pointer" }}>
                          Remove
                        </button>
                      </div>
                    )}
                    {(!editing || past) && onImportSingle && (
                      <button onClick={ev => {
                        ev.stopPropagation();
                        onImportSingle(e);
                      }}
                        style={{ background: "#f0f0f0", border: "none", borderRadius: 6,
                          padding: "3px 8px", fontSize: 11, color: "#555", cursor: "pointer", flexShrink: 0 }}>
                        + Log
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>{e.city} · {e.cuisine || e.type}</div>
                </div>
              ))}
              {editing && (
                <div style={{ fontSize: 12, color: "#aaa", textAlign: "center", padding: "6px 0" }}>
                  Search above to add places to Day {day.day}
                </div>
              )}
            </div>
          ))}
          {editing && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
              <button onClick={addDay}
                style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8, padding: "10px",
                  color: "#555", fontSize: 13, cursor: "pointer" }}>
                + Add Day
              </button>
              <button onClick={() => setEditing(false)}
                style={{ width: "100%", background: "#000", border: "none", borderRadius: 8, padding: "10px",
                  color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Done Editing
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ─── EXPLORE TAB COMPONENT ───────────────────────────────────────────────────
function ExploreTab({ entries, savedTrips, onAddToTrip, onViewProfile }) {
  const [exploreTab, setExploreTab] = useState("network"); // network | popular
  // Network filters
  const [networkCategory, setNetworkCategory] = useState("all");
  const [networkSearch, setNetworkSearch] = useState("");
  const [networkVerdict, setNetworkVerdict] = useState("all");
  // Popular filters
  const [popularCategory, setPopularCategory] = useState("all");
  const [popularSearch, setPopularSearch] = useState("");

  const allUsers = [...MOCK_USERS, ...MOCK_DISCOVER];
  // Friends entries only (not current user u1)
  const networkEntries = entries.filter(e => e.userId !== "u1" && !e.isActivity);

  const filteredNetwork = networkEntries.filter(e => {
    if (networkSearch.trim()) {
      const q = networkSearch.toLowerCase();
      if (!e.name.toLowerCase().includes(q) &&
          !e.city?.toLowerCase().includes(q) &&
          !e.state?.toLowerCase().includes(q) &&
          !e.cuisine?.toLowerCase().includes(q)) return false;
    }
    if (networkVerdict !== "all" && e.verdict !== networkVerdict) return false;
    if (networkCategory === "food") return ["restaurant","cafe","brewery"].includes(e.type);
    if (networkCategory === "hotels") return e.type === "hotel";
    if (networkCategory === "hiking") {
      const activity = MOCK_ACTIVITIES.find(a => a.name === e.name);
      return activity?.category === "hiking";
    }
    if (networkCategory === "kids") {
      const activity = MOCK_ACTIVITIES.find(a => a.name === e.name);
      return activity?.category === "kids";
    }
    if (networkCategory === "activities") {
      const activity = MOCK_ACTIVITIES.find(a => a.name === e.name);
      return activity?.category === "scenic" || activity?.category === "outdoor";
    }
    return true;
  });

  // For hiking/kids/activities in network tab, use MOCK_ACTIVITIES
  const networkActivities = entries.filter(e => {
    if (e.userId === "u1") return false; // exclude own entries
    if (!e.isActivity) return false;
    if (networkCategory === "hiking") return e.type === "hiking";
    if (networkCategory === "kids") return e.type === "kids";
    if (networkCategory === "activities") return e.type === "scenic" || e.type === "outdoor";
    return false;
  });

  const cityKey = Object.keys(POPULAR_PLACES).find(k =>
    popularSearch.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(popularSearch.toLowerCase())
  );
  const popularPlaces = popularSearch.trim()
    ? (POPULAR_PLACES[cityKey] || POPULAR_PLACES["default"])
    : POPULAR_PLACES["Denver"];

  const filteredPopular = popularPlaces.filter(p => {
    if (popularCategory === "food") return ["restaurant","cafe","brewery","market"].includes(p.type);
    if (popularCategory === "hiking") return p.type === "park" || p.category === "Outdoors";
    if (popularCategory === "activities") return ["landmark","neighborhood","museum"].includes(p.type);
    return true;
  });

  const catBtn = (val, current, setter, label) => (
    <button key={val} onClick={() => setter(val)}
      style={{ background: current === val ? "#000" : "#f8f8f8",
        border: `1px solid ${current === val ? "#000" : "#efefef"}`,
        color: current === val ? "#fff" : "#555",
        borderRadius: 20, padding: "6px 14px", cursor: "pointer",
        fontSize: 12, whiteSpace: "nowrap", flexShrink: 0 }}>
      {label}
    </button>
  );

  return (
    <div>
      {/* Main tabs: Network | Popular */}
      <div style={{ display: "flex", gap: 0, marginBottom: 16, background: "#f0f0f0", borderRadius: 10, padding: 3 }}>
        {[["network", "👥 Network"], ["popular", "⭐ Popular"]].map(([id, label]) => (
          <button key={id} onClick={() => setExploreTab(id)}
            style={{ flex: 1, background: exploreTab === id ? "#fff" : "transparent",
              border: "none", borderRadius: 8, padding: "10px 8px", cursor: "pointer",
              color: exploreTab === id ? "#000" : "#888", fontWeight: exploreTab === id ? 600 : 400,
              fontSize: 13, boxShadow: exploreTab === id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.2s" }}>
            {label}
          </button>
        ))}
      </div>

      {/* NETWORK TAB */}
      {exploreTab === "network" && (
        <div>
          {/* Search */}
          <div style={{ position: "relative", marginBottom: 12 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }}>🔍</span>
            <input value={networkSearch} onChange={e => setNetworkSearch(e.target.value)}
              placeholder="Search by place, city, state, cuisine..."
              style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10,
                padding: "11px 12px 11px 34px", color: "#000", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            {networkSearch && <button onClick={() => setNetworkSearch("")}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 16 }}>×</button>}
          </div>

          {/* Category filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto", paddingBottom: 2 }}>
            {catBtn("all", networkCategory, setNetworkCategory, "All")}
            {catBtn("food", networkCategory, setNetworkCategory, "🍽 Food")}
            {catBtn("hotels", networkCategory, setNetworkCategory, "🏨 Hotels")}
            {catBtn("hiking", networkCategory, setNetworkCategory, "🥾 Hiking")}
            {catBtn("kids", networkCategory, setNetworkCategory, "👶 Kids")}
            {catBtn("activities", networkCategory, setNetworkCategory, "⛺ Activities")}
          </div>

          {/* Verdict filter for food */}
          {networkCategory === "food" && (
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[["all","All"],["must_go","✓ Must Go"],["skip","✕ Skip"]].map(([v,l]) => (
                <button key={v} onClick={() => setNetworkVerdict(v)}
                  style={{ background: networkVerdict === v ? "#000" : "#f8f8f8",
                    border: `1px solid ${networkVerdict === v ? "#000" : "#efefef"}`,
                    color: networkVerdict === v ? "#fff" : "#555",
                    borderRadius: 20, padding: "5px 14px", cursor: "pointer", fontSize: 12 }}>
                  {l}
                </button>
              ))}
            </div>
          )}

          {/* Results count */}
          <div style={{ fontSize: 12, color: "#888", marginBottom: 12, fontWeight: 500 }}>
            {networkCategory === "all" || networkCategory === "food"
              ? `${filteredNetwork.length} places from your network`
              : `${networkActivities.length} ${networkCategory} from your network`}
          </div>

          {/* Entries */}
          {(networkCategory === "all" || networkCategory === "food") && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredNetwork.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#aaa" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
                  <div style={{ fontSize: 14 }}>No results found</div>
                </div>
              ) : filteredNetwork.map(e => {
                const user = allUsers.find(u => u.id === e.userId);
                return (
                  <div key={e.id} style={{ position: "relative" }}>
                    <EntryCard entry={e} user={user} onViewProfile={onViewProfile} />
                    {savedTrips && savedTrips.filter(t => !t.completed).length > 0 && (
                      <div style={{ position: "absolute", bottom: 12, right: 12 }}>
                        <select onChange={ev => { if (ev.target.value && onAddToTrip) { onAddToTrip(ev.target.value, e); ev.target.value = ""; }}}
                          style={{ background: "#000", color: "#fff", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}
                          defaultValue="">
                          <option value="" disabled>+ Trip</option>
                          {savedTrips.filter(t => !t.completed).map(t => (
                            <option key={t.id} value={t.id}>{t.destination}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Activities */}
          {(networkCategory === "hiking" || networkCategory === "kids" || networkCategory === "activities") && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {networkActivities.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#aaa" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🏔</div>
                  <div style={{ fontSize: 14 }}>No {networkCategory} from your network</div>
                </div>
              ) : networkActivities.map(e => {
                const user = allUsers.find(u => u.id === e.userId);
                return <ActivityCard key={e.id} activity={e} user={user} />;
              })}
            </div>
          )}
        </div>
      )}

      {/* POPULAR TAB */}
      {exploreTab === "popular" && (
        <div>
          {/* Search by city */}
          <div style={{ position: "relative", marginBottom: 12 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }}>🔍</span>
            <input value={popularSearch} onChange={e => setPopularSearch(e.target.value)}
              placeholder="Search a city (e.g. Denver, Boulder)..."
              style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10,
                padding: "11px 12px 11px 34px", color: "#000", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            {popularSearch && <button onClick={() => setPopularSearch("")}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 16 }}>×</button>}
          </div>

          {/* Category filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto", paddingBottom: 2 }}>
            {catBtn("all", popularCategory, setPopularCategory, "All")}
            {catBtn("food", popularCategory, setPopularCategory, "🍽 Food")}
            {catBtn("hiking", popularCategory, setPopularCategory, "🥾 Outdoors")}
            {catBtn("activities", popularCategory, setPopularCategory, "⭐ Attractions")}
          </div>

          <div style={{ fontSize: 12, color: "#888", marginBottom: 12, fontWeight: 500 }}>
            {popularSearch.trim() ? `Popular in ${popularSearch}` : "Popular in Denver, CO"} · {filteredPopular.length} places
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredPopular.map(p => (
              <div key={p.id} style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <a href={`https://www.google.com/maps/search/${encodeURIComponent(p.name + ' ' + p.city)}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 15, fontWeight: 600, color: "#000", textDecoration: "none" }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                        {p.name} ↗
                      </a>
                      <span style={{ background: "#f0f0f0", color: "#555", borderRadius: 4, padding: "2px 8px", fontSize: 11 }}>{p.category}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{p.city}, {p.state}</div>
                    <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>{p.desc}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: "#FFB800", fontSize: 13 }}>★</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>{p.rating}</span>
                  <span style={{ fontSize: 12, color: "#aaa" }}>({p.reviews.toLocaleString()} reviews)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MY LOGS TAB COMPONENT ───────────────────────────────────────────────────
function MyLogsTab({ entries, currentUser, savedTrips, setEntries, setEditingEntry, showImport, setShowImport }) {
  const [logsCategory, setLogsCategory] = useState("all");
  const [logsSearch, setLogsSearch] = useState("");
  const [importResult, setImportResult] = useState(null);
  const myEntries = entries.filter(e => e.userId === "u1");

  const parseAllTrailsCSV = (text) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, "").toLowerCase());
    const imported = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].match(/(".*?"|[^,]+)(?=,|$)/g) || [];
      const row = {};
      headers.forEach((h, idx) => { row[h] = (cols[idx] || "").replace(/"/g, "").trim(); });
      const name = row["name"] || row["trail name"] || row["activity name"] || "";
      if (!name) continue;
      imported.push({
        id: "at_" + Date.now() + "_" + i,
        userId: "u1", name, type: "hiking", isActivity: true, category: "hiking",
        city: row["location"] || row["city"] || "", state: row["state"] || row["region"] || "",
        country: "USA", distance: row["distance (mi)"] || row["distance"] || "",
        elevGain: row["elevation gain (ft)"] || row["elevation gain"] || "",
        difficulty: row["difficulty"] ? row["difficulty"].toLowerCase() : "moderate",
        notes: row["notes"] || row["description"] || "",
        rating: row["rating"] ? parseInt(row["rating"]) : null,
        verdict: "must_go", tags: ["alltrails", "imported"], kidFriendly: false, photos: []
      });
    }
    return imported;
  };

  const filteredLogs = myEntries.filter(e => {
    if (logsSearch.trim()) {
      const q = logsSearch.toLowerCase();
      if (!e.name.toLowerCase().includes(q) &&
          !e.city?.toLowerCase().includes(q) &&
          !e.state?.toLowerCase().includes(q) &&
          !(e.cuisine || "").toLowerCase().includes(q)) return false;
    }
    if (logsCategory === "food") return ["restaurant","cafe","brewery"].includes(e.type);
    if (logsCategory === "hotels") return e.type === "hotel";
    if (logsCategory === "hiking") return e.type === "hiking";
    if (logsCategory === "kids") return e.type === "kids";
    if (logsCategory === "activities") return e.type === "scenic" || e.type === "outdoor";
    return true;
  });

  const catBtn = (val, label) => (
    <button key={val} onClick={() => setLogsCategory(val)}
      style={{ background: logsCategory === val ? "#000" : "#f8f8f8",
        border: `1px solid ${logsCategory === val ? "#000" : "#efefef"}`,
        color: logsCategory === val ? "#fff" : "#555",
        borderRadius: 20, padding: "6px 14px", cursor: "pointer",
        fontSize: 12, whiteSpace: "nowrap", flexShrink: 0 }}>
      {label}
    </button>
  );

  return (
    <div>
      {/* Profile card */}
      <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 12, padding: "16px 18px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, background: "#f0f0f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
            {currentUser.avatar}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#000" }}>{currentUser.name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>@{currentUser.username}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
          {[["Logs", myEntries.length],["Must Go", myEntries.filter(e=>e.verdict==="must_go").length],["Cities", new Set(myEntries.map(e=>e.city)).size],["Trips", savedTrips.length]].map(([l,v]) => (
            <div key={l}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#000" }}>{v}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Import */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }}>🔍</span>
          <input value={logsSearch} onChange={e => setLogsSearch(e.target.value)}
            placeholder="Search by name, city, state, cuisine..."
            style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10,
              padding: "11px 12px 11px 34px", color: "#000", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          {logsSearch && <button onClick={() => setLogsSearch("")}
            style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 16 }}>×</button>}
        </div>
        <button onClick={() => setShowImport(!showImport)}
          style={{ background: showImport ? "#000" : "#f8f8f8", border: "1px solid #efefef", borderRadius: 10,
            padding: "11px 14px", fontSize: 12, color: showImport ? "#fff" : "#555", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
          🥾 Import
        </button>
      </div>

      {/* AllTrails Import Panel */}
      {showImport && (
        <div style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#000", marginBottom: 6 }}>Import from AllTrails</div>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 12, lineHeight: 1.6 }}>
            AllTrails → Profile → Settings → Export Data → download CSV, then select below.
          </div>
          {!importResult ? (
            <div style={{ background: "#fff0e0", border: "1px solid #fdd", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#888", lineHeight: 1.6 }}>
              📲 File upload coming soon — will work once the app is deployed. Stay tuned!
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 13, color: "#000", marginBottom: 10 }}>
                {importResult.length === 0 ? "No hikes found — check the file format." : <><strong>{importResult.length}</strong> hike{importResult.length !== 1 ? "s" : ""} found</>}
              </div>
              {importResult.slice(0, 3).map((h, i) => (
                <div key={i} style={{ fontSize: 12, color: "#555", padding: "4px 0", borderBottom: "1px solid #efefef" }}>
                  🥾 {h.name} {h.distance ? `· ${h.distance}` : ""}
                </div>
              ))}
              {importResult.length > 3 && <div style={{ fontSize: 12, color: "#aaa", padding: "4px 0" }}>+{importResult.length - 3} more</div>}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => { setEntries(prev => [...importResult, ...prev]); setImportResult(null); setShowImport(false); setLogsCategory("hiking"); }}
                  style={{ flex: 1, background: "#000", border: "none", borderRadius: 8, padding: "10px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Import All
                </button>
                <button onClick={() => { setImportResult(null); setShowImport(false); }}
                  style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8, padding: "10px 14px", color: "#555", fontSize: 13, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 2 }}>
        {catBtn("all", "All")}
        {catBtn("food", "🍽 Food")}
        {catBtn("hotels", "🏨 Hotels")}
        {catBtn("hiking", "🥾 Hiking")}
        {catBtn("kids", "👶 Kids")}
        {catBtn("activities", "⛺ Activities")}
      </div>

      {/* Count */}
      <div style={{ fontSize: 12, color: "#888", marginBottom: 12, fontWeight: 500 }}>
        {filteredLogs.length} {logsCategory === "all" ? "logs" : logsCategory}
      </div>

      {/* Entries */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 24px" }}>
            {logsSearch ? (
              <>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#000", marginBottom: 6 }}>No results found</div>
                <div style={{ fontSize: 13, color: "#aaa" }}>Try a different search term</div>
              </>
            ) : logsCategory !== "all" ? (
              <>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{{ food:"🍽", hotels:"🏨", hiking:"🥾", kids:"👶", activities:"⛺" }[logsCategory] || "📍"}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#000", marginBottom: 6 }}>No {logsCategory} logged yet</div>
                <div style={{ fontSize: 13, color: "#aaa" }}>Tap + Log to add your first one</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🗺</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#000", marginBottom: 8 }}>Your travel story starts here</div>
                <div style={{ fontSize: 14, color: "#888", marginBottom: 24, lineHeight: 1.6 }}>
                  Log restaurants, hikes, hotels and more.<br/>Build your personal travel guide.
                </div>
                <button onClick={() => setShowAddModal(true)}
                  style={{ background: "#000", border: "none", borderRadius: 12, padding: "14px 28px",
                    color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  + Log Your First Place
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {filteredLogs.map(e => (
              e.isActivity ? (
                <ActivityCard key={e.id} activity={e} isPrivate={e.isPrivate}
                  onEdit={() => setEditingEntry(e)}
                  onTogglePrivate={() => setEntries(prev => prev.map(en => en.id === e.id ? {...en, isPrivate: !en.isPrivate} : en))}
                />
              ) : (
                <EntryCard key={e.id} entry={e} isPrivate={e.isPrivate}
                  onEdit={() => setEditingEntry(e)}
                  onTogglePrivate={() => setEntries(prev => prev.map(en => en.id === e.id ? {...en, isPrivate: !en.isPrivate} : en))}
                />
              )
            ))}
          </>
        )}
      </div>
    </div>
  );
}


// ─── MAIN APP ────────────────────────────────────────────────────────────────
function MainApp({ user, onLogout }) {
  const [tab, setTab] = useState("mine");
  const [showNetwork, setShowNetwork] = useState(false);
  const [entries, setEntries] = useState([
    ...MOCK_ENTRIES,
    ...MOCK_ACTIVITIES.map(a => ({
      ...a,
      type: a.category, // hiking, kids, scenic, outdoor
      verdict: "must_go",
      cuisine: null,
      dish: null,
      rating: null,
      isActivity: true
    }))
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [prefillEntry, setPrefillEntry] = useState(null);
  const [showTripModal, setShowTripModal] = useState(false);
  const [viewProfile, setViewProfile] = useState(null);
  // u2, u3, u7, u8 are confirmed friends; u4,u5,u6 are discoverable
  const [friendState, setFriendState] = useState({ u2: "friend", u3: "friend", u7: "friend", u8: "friend" });
  // Simulate incoming request from u4
  const [pendingIncoming, setPendingIncoming] = useState([{ from: "u4" }]);

  const [editingEntry, setEditingEntry] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [localUser, setLocalUser] = useState({ ...user });
  const [profileForm, setProfileForm] = useState({ name: user.name, username: user.username, bio: user.bio || "" });
  const [importToLogsMsg, setImportToLogsMsg] = useState("");
  const [sharedTrips, setSharedTrips] = useState([
    {
      id: "shared_1", sharedBy: "u3", sharedAt: "4/8/2025",
      destination: "Aspen, CO", days: 3, kids: false, completed: false,
      plan: { days: [
        { day: 1, city: "Aspen", activity: "Maroon Bells hike", entries: [
          { id: "s1e1", name: "White House Tavern", type: "restaurant", city: "Aspen", state: "CO", verdict: "must_go", cuisine: "American" },
          { id: "s1e2", name: "Justice Snow's", type: "restaurant", city: "Aspen", state: "CO", verdict: "must_go", cuisine: "Cocktail Bar" }
        ]},
        { day: 2, city: "Aspen", activity: "Independence Pass drive", entries: [
          { id: "s2e1", name: "New Belgium Ranger Station", type: "brewery", city: "Aspen", state: "CO", verdict: "must_go", cuisine: "Craft Beer" }
        ]}
      ]}
    }
  ]); // trips shared by friends
  const [savedTrips, setSavedTrips] = useState([]);

  const currentUser = MOCK_USERS[0];

  if (viewProfile) {
    const profileUser = [...MOCK_USERS, ...MOCK_DISCOVER].find(u => u.id === viewProfile) || MOCK_USERS[1];
    return (
      <div style={{ minHeight: "100vh", background: "#fff", padding: "20px 16px", maxWidth: 600, margin: "0 auto" }}>
        <ProfileView user={profileUser} entries={entries} onBack={() => setViewProfile(null)} savedTrips={savedTrips} onAddToTrip={(tripId, entry) => setSavedTrips(prev => prev.map(t => { if (t.id !== tripId) return t; const updatedDays = t.plan?.days ? [...t.plan.days] : []; if (updatedDays.length === 0) updatedDays.push({ day: 1, city: t.destination, entries: [], activity: "" }); updatedDays[0] = { ...updatedDays[0], entries: [...updatedDays[0].entries, entry] }; return { ...t, plan: { ...t.plan, days: updatedDays } }; }))} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#000" }}>
      <style>{`
        
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0a0a; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        input:focus, textarea:focus { border-color: #000 !important; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #efefef", padding: "14px 20px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#000", fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>Travel Slate</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setShowAddModal(true)}
              style={{ background: "#000", border: "none", borderRadius: 8, padding: "8px 16px",
                color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
              + Log
            </button>
            <button onClick={() => setShowGlobalSearch(!showGlobalSearch)}
              style={{ background: "none", border: "1px solid #efefef", borderRadius: 8, padding: "8px 10px",
                color: "#555", fontSize: 12, cursor: "pointer" }}>
              🔍
            </button>
            <button onClick={() => setShowEditProfile(true)}
              style={{ background: "none", border: "1px solid #efefef", borderRadius: "50%", width: 36, height: 36,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              {localUser.avatar || "👤"}
            </button>
            <button onClick={() => setShowNetwork(true)}
              style={{ background: "none", border: "1px solid #efefef", borderRadius: 8, padding: "8px 10px",
                color: "#555", fontSize: 12, cursor: "pointer" }}>
              👥
            </button>
            <button onClick={onLogout}
              style={{ background: "none", border: "1px solid #efefef", borderRadius: 8, padding: "8px 14px",
                color: "#888", fontSize: 12, cursor: "pointer" }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ borderBottom: "1px solid #efefef", background: "#fff", position: "sticky", top: 57, zIndex: 40 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex" }}>
          {[["mine","My Logs"],["explore","Explore"],["trips","My Trips"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ flex: 1, background: "none", border: "none", borderBottom: `2px solid ${tab === id ? "#000" : "transparent"}`,
                color: tab === id ? "#000" : "#888", padding: "14px 0", cursor: "pointer",
                fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", transition: "all 0.2s",
                position: "relative" }}>
              {label}

            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* EXPLORE TAB */}
        {tab === "explore" && (
          <ExploreTab
            entries={entries}
            savedTrips={savedTrips}
            onAddToTrip={(tripId, entry) => setSavedTrips(prev => prev.map(t => {
              if (t.id !== tripId) return t;
              const updatedDays = t.plan?.days ? [...t.plan.days] : [];
              if (updatedDays.length === 0) updatedDays.push({ day: 1, city: t.destination, entries: [], activity: "" });
              updatedDays[0] = { ...updatedDays[0], entries: [...updatedDays[0].entries, entry] };
              return { ...t, plan: { ...t.plan, days: updatedDays } };
            }))}
            onViewProfile={setViewProfile}
          />
        )}

        {/* MY LOGS TAB */}
        {tab === "mine" && (
          <MyLogsTab
            entries={entries}
            currentUser={localUser}
            savedTrips={savedTrips}
            setEntries={setEntries}
            setEditingEntry={setEditingEntry}
            showImport={showImport}
            setShowImport={setShowImport}
          />
        )}

        {/* MY TRIPS TAB */}
        {tab === "trips" && (
          <div>
            {importToLogsMsg && (
              <div style={{ background: "#000", color: "#fff", borderRadius: 8, padding: "12px 16px",
                fontSize: 13, marginBottom: 16, textAlign: "center" }}>
                {importToLogsMsg}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#000" }}>My Trips</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{savedTrips.length} saved</div>
              </div>
              <button onClick={() => setShowTripModal(true)}
                style={{ background: "#000", border: "none", borderRadius: 8, padding: "10px 16px",
                  color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                + Plan Trip
              </button>
            </div>

            {/* Planning section */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#888", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
                Planning
              </div>
              {savedTrips.filter(t => !t.completed).length === 0 ? (
                <div style={{ background: "#f8f8f8", borderRadius: 12, padding: "32px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>✈️</div>
                  <div style={{ fontSize: 14, color: "#888" }}>No trips in planning yet</div>
                  <div style={{ fontSize: 13, color: "#aaa", marginTop: 4 }}>Tap + Plan Trip to get started</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {savedTrips.filter(t => !t.completed).map(trip => (
                    <TripCard key={trip.id} trip={trip} entries={entries}
                      onDelete={() => setSavedTrips(prev => prev.filter(t => t.id !== trip.id))}
                      onComplete={() => setSavedTrips(prev => prev.map(t => t.id === trip.id ? {...t, completed: true} : t))}
                      onInviteFriend={uid => setSavedTrips(prev => prev.map(t => t.id === trip.id ? {...t, invitedFriends: (t.invitedFriends||[]).includes(uid) ? (t.invitedFriends||[]).filter(x=>x!==uid) : [...(t.invitedFriends||[]), uid]} : t))}
                      onAddPlaces={() => setShowTripModal(true)}
                      onUpdate={updated => setSavedTrips(prev => prev.map(t => t.id === updated.id ? updated : t))}
                      onShare={(uid, uname) => {
                        setSavedTrips(prev => prev.map(t => t.id === trip.id ? {
                          ...t,
                          sharedWithList: [...new Set([...(t.sharedWithList || []), uid])]
                        } : t));
                        setImportToLogsMsg("✓ Trip shared with " + (uname || "friend") + "!");
                        setTimeout(() => setImportToLogsMsg(""), 3000);
                      }}
                      onImportToLogs={() => {
                        const days = trip.plan?.days || [];
                        const tripEntries = days.flatMap(d => {
                          const items = d.entries || d.items || [];
                          return items.map((e, j) => ({
                            ...e,
                            id: "imp_" + (e.id || j) + "_" + Date.now(),
                            userId: "u1",
                            verdict: e.verdict || "must_go",
                            rating: e.rating || 0,
                            notes: e.notes || e.note || "",
                            tags: e.tags || [],
                            photos: [],
                            type: e.type || "activity",
                            city: e.city || trip.destination || "",
                            country: e.country || "USA"
                          }));
                        }).filter(e => e.name && e.name.trim());
                        setImportToLogsMsg("✓ Imported " + tripEntries.length + " place" + (tripEntries.length !== 1 ? "s" : "") + " to My Logs!");
                        setTimeout(() => setImportToLogsMsg(""), 3000);
                        setEntries(prev => [...tripEntries, ...prev]);
                      }}
                      onImportSingle={entry => {
                        setPrefillEntry(entry);
                        setShowAddModal(true);
                      }}
                      friendState={friendState}
                      allUsers={[...MOCK_USERS, ...MOCK_DISCOVER]}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Friends shared trips */}
            {sharedTrips.filter(t => t.sharedBy !== "u1").length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#888", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
                  Shared With You
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {sharedTrips.filter(t => t.sharedBy !== "u1").map(trip => {
                    const sharer = [...MOCK_USERS, ...MOCK_DISCOVER].find(u => u.id === trip.sharedBy);
                    return (
                      <SharedTripCard key={trip.id} trip={trip} sharer={sharer}
                        onImportToLogs={(entry) => {
                          setEntries(prev => [{ ...entry, id: "imp_" + Date.now(), userId: "u1" }, ...prev]);
                          setImportToLogsMsg("✓ Added " + entry.name + " to My Logs!");
                          setTimeout(() => setImportToLogsMsg(""), 2500);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past section */}
            {savedTrips.filter(t => t.completed).length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#888", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
                  Past Trips
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {savedTrips.filter(t => t.completed).map(trip => (
                    <TripCard key={trip.id} trip={trip} entries={entries}
                      onDelete={() => setSavedTrips(prev => prev.filter(t => t.id !== trip.id))}
                      past
                      onImportToLogs={() => {
                        const days = trip.plan?.days || [];
                        const tripEntries = days.flatMap(d => {
                          const items = d.entries || d.items || [];
                          return items.map((e, j) => ({
                            ...e,
                            id: "imp_" + (e.id || j) + "_" + Date.now(),
                            userId: "u1",
                            verdict: e.verdict || "must_go",
                            rating: e.rating || 0,
                            notes: e.notes || e.note || "",
                            tags: e.tags || [],
                            photos: [],
                            type: e.type || "activity",
                            city: e.city || trip.destination || "",
                            country: e.country || "USA"
                          }));
                        }).filter(e => e.name && e.name.trim());
                        setImportToLogsMsg("✓ Imported " + tripEntries.length + " place" + (tripEntries.length !== 1 ? "s" : "") + " to My Logs!");
                        setTimeout(() => setImportToLogsMsg(""), 3000);
                        setEntries(prev => [...tripEntries, ...prev]);
                      }}
                      onImportSingle={entry => {
                        setPrefillEntry(entry);
                        setShowAddModal(true);
                      }}
                      onShare={(uid, uname) => {
                        setSavedTrips(prev => prev.map(t => t.id === trip.id ? {
                          ...t,
                          sharedWithList: [...new Set([...(t.sharedWithList || []), uid])]
                        } : t));
                        setImportToLogsMsg("✓ Trip shared with " + (uname || "friend") + "!");
                        setTimeout(() => setImportToLogsMsg(""), 3000);
                      }}
                      friendState={friendState}
                      allUsers={[...MOCK_USERS, ...MOCK_DISCOVER]}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showEditProfile && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 420 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Edit Profile</h2>
              <button onClick={() => setShowEditProfile(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#aaa" }}>×</button>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Full Name</label>
              <input value={profileForm.name} onChange={e => setProfileForm(f => ({...f, name: e.target.value}))}
                style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8, padding: "11px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Username</label>
              <input value={profileForm.username} onChange={e => setProfileForm(f => ({...f, username: e.target.value}))}
                style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8, padding: "11px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Bio</label>
              <textarea value={profileForm.bio} onChange={e => setProfileForm(f => ({...f, bio: e.target.value}))}
                placeholder="Tell us about your travel style..."
                rows={3}
                style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8, padding: "11px 12px", fontSize: 14, outline: "none", resize: "none", boxSizing: "border-box" }} />
            </div>
            <button onClick={() => {
                setLocalUser(u => ({ ...u, name: profileForm.name, username: profileForm.username, bio: profileForm.bio }));
                setShowEditProfile(false);
              }}
              style={{ width: "100%", background: "#000", border: "none", borderRadius: 8, padding: 13, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {showAddModal && <AddEntryModal key={Date.now()} onClose={() => { setShowAddModal(false); setPrefillEntry(null); }} onSave={e => setEntries(prev => [e, ...prev])} entries={entries} prefill={prefillEntry} />}
      {editingEntry && <EditEntryModal entry={editingEntry} onClose={() => setEditingEntry(null)} onSave={updated => {
        setEntries(prev => prev.map(e => e.id === updated.id ? updated : e));
        setEditingEntry(null);
      }} />}
      {showNetwork && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <div onClick={() => setShowNetwork(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(380px, 95vw)", background: "#fff", overflowY: "auto", boxShadow: "-4px 0 20px rgba(0,0,0,0.15)" }}>
            <div style={{ padding: "20px 16px", borderBottom: "1px solid #efefef", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#000" }}>Network</div>
              <button onClick={() => setShowNetwork(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#aaa" }}>×</button>
            </div>
            <div style={{ padding: "16px" }}>
              <NetworkTab
                entries={entries}
                onViewProfile={id => { setViewProfile(id); setShowNetwork(false); }}
                friendState={friendState}
                setFriendState={setFriendState}
                pendingIncoming={pendingIncoming}
                setPendingIncoming={setPendingIncoming}
              />
            </div>
          </div>
        </div>
      )}
      {showTripModal && <TripPlannerModal entries={entries} onClose={() => setShowTripModal(false)} savedTrips={savedTrips} onSaveTrip={trip => setSavedTrips(prev => { const exists = prev.find(t => t.id === trip.id); return exists ? prev.map(t => t.id === trip.id ? trip : t) : [trip, ...prev]; })} onUpdateTrip={updated => setSavedTrips(prev => prev.map(t => t.id === updated.id ? updated : t))} />}
      
    </div>
  );
}

// ─── LANDING PAGE ───────────────────────────────────────────────────────────
function LandingPage({ onGetStarted, onLogin }) {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .auth-btn:hover { opacity: 0.85; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 380, animation: "fadeUp 0.5s ease-out", textAlign: "center" }}>
        {/* Logo */}
        <div style={{ marginBottom: 8, fontSize: 36 }}>🗺</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#000", letterSpacing: "-0.03em", marginBottom: 6 }}>Travel Slate</div>
        <div style={{ fontSize: 15, color: "#888", marginBottom: 40, lineHeight: 1.5 }}>
          Travel recs from people you actually trust
        </div>

        {/* Auth buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Google */}
          <button className="auth-btn" onClick={onLogin}
            style={{ width: "100%", background: "#fff", border: "1px solid #dbdbdb", borderRadius: 8,
              padding: "13px 16px", fontSize: 15, fontWeight: 500, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              color: "#000", transition: "opacity 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.3 0-9.8-3.6-11.3-8.5l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"/>
            </svg>
            Continue with Google
          </button>

          {/* Facebook */}
          <button className="auth-btn" onClick={onLogin}
            style={{ width: "100%", background: "#1877F2", border: "none", borderRadius: 8,
              padding: "13px 16px", fontSize: 15, fontWeight: 500, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              color: "#fff", transition: "opacity 0.2s" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#dbdbdb" }} />
            <span style={{ color: "#aaa", fontSize: 13, fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "#dbdbdb" }} />
          </div>

          {/* Sign Up */}
          <button className="auth-btn" onClick={onGetStarted}
            style={{ width: "100%", background: "#000", border: "none", borderRadius: 8,
              padding: "13px 16px", fontSize: 15, fontWeight: 600, cursor: "pointer",
              color: "#fff", transition: "opacity 0.2s" }}>
            Sign up with email
          </button>

          {/* Sign In */}
          <button className="auth-btn" onClick={onLogin}
            style={{ width: "100%", background: "transparent", border: "1px solid #dbdbdb", borderRadius: 8,
              padding: "13px 16px", fontSize: 15, fontWeight: 500, cursor: "pointer",
              color: "#000", transition: "opacity 0.2s" }}>
            Log in
          </button>
        </div>


      </div>
    </div>
  );
}


// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────
function AuthScreen({ mode: initialMode, onAuth, onBack }) {
  const [mode, setMode] = useState(initialMode || "signup");
  const [form, setForm] = useState({ email: "", password: "", name: "", inviteCode: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setError("");
    if (mode === "signup") {
      if (!form.email || !form.password || !form.name) { setError("Please fill in all fields."); return; }
      if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }

    } else {
      if (!form.email || !form.password) { setError("Please enter your email and password."); return; }
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuth({ id: "u1", email: form.email, name: form.name || "Sandy S.", username: form.email.split("@")[0] });
    }, 1200);
  };

  const inp = (field, label, placeholder, type = "text") => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>
      <input type={type} value={form[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        placeholder={placeholder}
        style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
          padding: "12px 14px", color: "#000", fontSize: 14,
          marginTop: 5, boxSizing: "border-box", outline: "none", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "#000"}
        onBlur={e => e.target.style.borderColor = "#efefef"}
      />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{`
        
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp 0.5s ease-out" }}>
        <button onClick={onBack}
          style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 24 }}>
          ← Back
        </button>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#000", letterSpacing: "-0.03em" }}>Travel Slate</div>
          <div style={{ color: "#444", fontSize: 10, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.12em", marginTop: 4 }}>
            {mode === "signup" ? "JOIN THE BETA" : "WELCOME BACK"}
          </div>
        </div>

        {/* Mode toggle */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "#f0f0f0", borderRadius: 8, padding: 3 }}>
          {[["signup", "Sign Up"], ["login", "Sign In"]].map(([id, label]) => (
            <button key={id} onClick={() => { setMode(id); setError(""); }}
              style={{ flex: 1, background: mode === id ? "#000" : "transparent",
                border: "none", borderRadius: 6, padding: "10px", cursor: "pointer",
                color: mode === id ? "#fff" : "#888",
                fontSize: 13, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: mode === id ? 700 : 400,
                transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Google Sign-in */}
        <button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onAuth({ id: "u1", email: "sandy@gmail.com", name: "Sandy S.", username: "sandy_explores" }); }, 1000); }}
          style={{ width: "100%", background: "#fff", border: "1px solid #dbdbdb", borderRadius: 8, padding: "12px 16px",
            color: "#000", fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.3 0-9.8-3.6-11.3-8.5l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"/></svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "#efefef" }} />
          <span style={{ color: "#aaa", fontSize: 11 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#efefef" }} />
        </div>

        {mode === "signup" && inp("name", "Full Name", "Sandy Sapkota")}
        {inp("email", "Email", "you@email.com", "email")}
        {inp("password", "Password", mode === "signup" ? "At least 6 characters" : "Your password", "password")}


        {error && (
          <div style={{ background: "#450a0a", border: "1px solid #dc2626", borderRadius: 8, padding: "10px 14px",
            color: "#f87171", fontSize: 13, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", marginBottom: 16 }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", background: loading ? "#555" : "#000",
            border: "none", borderRadius: 8, padding: "14px", color: "#fff",
            fontSize: 15, fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            opacity: loading ? 0.7 : 1 }}>
          {loading ? "Authenticating…" : mode === "signup" ? "Create Account →" : "Sign In →"}
        </button>

        <div style={{ textAlign: "center", marginTop: 16, color: "#888", fontSize: 13 }}>
          {mode === "signup" ? "Already have an account?" : "New to Travel Slate?"}{" "}
          <span onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}
            style={{ color: "#000", cursor: "pointer", fontWeight: 600 }}>
            {mode === "signup" ? "Sign in" : "Get early access"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP (AUTH GATE) ───────────────────────────────────────────────────

// ─── ONBOARDING SCREEN ───────────────────────────────────────────────────────
function OnboardingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      emoji: "🗺",
      title: "Your Private Travel Intel",
      desc: "Log every place you visit — restaurants, hikes, hotels, activities. Build your personal travel guide."
    },
    {
      emoji: "🍽",
      title: "Log What You Love",
      desc: "Rate places, add notes, mark Must Go or Skip. Your honest takes, no sponsored content ever."
    },
    {
      emoji: "👥",
      title: "Trust Your Network",
      desc: "See where your friends have been. Get real recommendations from people you actually trust."
    },
    {
      emoji: "✈️",
      title: "Plan Better Trips",
      desc: "Build itineraries from your network's picks and your own saved ideas. Open in Google Maps with one tap."
    }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 32, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 48 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3,
              background: i === step ? "#000" : "#e0e0e0", transition: "all 0.3s" }} />
          ))}
        </div>

        {/* Content */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 72, marginBottom: 24 }}>{steps[step].emoji}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#000", marginBottom: 16, lineHeight: 1.2 }}>
            {steps[step].title}
          </div>
          <div style={{ fontSize: 16, color: "#888", lineHeight: 1.7 }}>
            {steps[step].desc}
          </div>
        </div>

        {/* Buttons */}
        {step < steps.length - 1 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button onClick={() => setStep(step + 1)}
              style={{ width: "100%", background: "#000", border: "none", borderRadius: 12,
                padding: "16px", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              Next →
            </button>
            <button onClick={onDone}
              style={{ width: "100%", background: "transparent", border: "none",
                color: "#aaa", fontSize: 14, cursor: "pointer" }}>
              Skip
            </button>
          </div>
        ) : (
          <button onClick={onDone}
            style={{ width: "100%", background: "#000", border: "none", borderRadius: 12,
              padding: "16px", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
            Get Started 🗺
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [screen, setScreen] = useState("landing"); // landing | auth-signup | auth-login | app | onboarding
  const [hasOnboarded, setHasOnboarded] = useState(false);

  if (screen === "onboarding") {
    return <OnboardingScreen onDone={() => { setHasOnboarded(true); setScreen("app"); }} />;
  }

  if (authUser && screen === "app") {
    return <MainApp user={authUser} onLogout={() => { setAuthUser(null); setScreen("landing"); }} />;
  }

  if (screen === "auth-signup" || screen === "auth-login") {
    return (
      <AuthScreen
        mode={screen === "auth-signup" ? "signup" : "login"}
        onAuth={(user) => { setAuthUser(user); if (!hasOnboarded) { setScreen("onboarding"); } else { setScreen("app"); } }}
        onBack={() => setScreen("landing")}
      />
    );
  }

  return (
    <LandingPage
      onGetStarted={() => setScreen("auth-signup")}
      onLogin={() => setScreen("auth-login")}
    />
  );
}
