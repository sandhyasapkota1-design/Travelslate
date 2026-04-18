import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import "./App.css";
import { createPortal } from "react-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "./lib/supabase";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: "u1", username: "sandy_explores", name: "Sandy S.", avatar: "🌿",
    avatarImg: "https://randomuser.me/api/portraits/women/44.jpg",
    tags: ["Globe Trotter", "Foodie Oracle", "Brew Connoisseur"],
    tripsCount: 34, countriesCount: 12, citiesCount: 67,
    bio: "Energy engineer by day, taco hunter by night. Colorado-based."
  },
  {
    id: "u2", username: "marco_eats", name: "Marco R.", avatar: "🍜",
    avatarImg: "https://randomuser.me/api/portraits/men/32.jpg",
    tags: ["Local Expert", "Ramen Pilgrim"],
    tripsCount: 18, countriesCount: 5, citiesCount: 28,
    bio: "I follow noodles across time zones."
  },
  {
    id: "u3", username: "priya_wanders", name: "Priya K.", avatar: "🏔",
    avatarImg: "https://randomuser.me/api/portraits/women/65.jpg",
    tags: ["Adventure Seeker", "Trail Blazer"],
    tripsCount: 52, countriesCount: 23, citiesCount: 110,
    bio: "Mountains first. Food second. Always both."
  },
  {
    id: "u7", username: "jen_sips", name: "Jen L.", avatar: "☕",
    avatarImg: "https://randomuser.me/api/portraits/women/17.jpg",
    tags: ["Coffee Pilgrim", "Brunch Queen"],
    tripsCount: 22, countriesCount: 7, citiesCount: 38,
    bio: "Cortado connoisseur. If the latte art is bad, I'm leaving."
  },
  {
    id: "u8", username: "dev_grills", name: "Dev P.", avatar: "🔥",
    avatarImg: "https://randomuser.me/api/portraits/men/8.jpg",
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


// ─── PACK LIST TEMPLATES ─────────────────────────────────────────────────────
const PACK_LIST_TEMPLATES = {
  "🏖 Beach": ["Sunscreen SPF 50+", "Swimsuit", "Beach towel", "Flip flops", "Sunglasses", "Hat / sun hat", "After-sun lotion", "Waterproof phone case", "Snorkel gear", "Reusable water bottle"],
  "⛷ Ski / Winter": ["Ski jacket", "Thermal base layers", "Ski gloves", "Goggles", "Beanie", "Neck gaiter", "Hand warmers", "Lip balm (SPF)", "Boot dryer", "Après-ski shoes"],
  "🥾 Hiking": ["Trail map + compass", "Water filter / purification tablets", "First aid kit", "Trekking poles", "Headlamp + batteries", "High-energy snacks", "Blister kit", "Emergency whistle", "Rain layer", "Sunscreen"],
  "🌆 City Break": ["Comfortable walking shoes", "Day pack / crossbody bag", "Travel adapter", "Portable charger", "Reusable tote bag", "Umbrella", "Guidebook or offline maps", "Earplugs (for busy hotels)", "Laundry bag", "Snacks for transit"],
  "🌍 International": ["Passport + copies", "Travel insurance docs", "Visa / entry docs", "Local currency", "Travel adapter (multi-region)", "Prescription meds + extra supply", "International SIM / eSIM", "Photocopy of ID", "Vaccination records", "Emergency contact card"],
  "🏕 Camping": ["Tent + stakes + poles", "Sleeping bag (rated for temp)", "Sleeping pad", "Camping stove + fuel", "Cookware set", "Headlamp + extra batteries", "Fire starter / matches", "Bear canister or hang bag", "Biodegradable soap", "Tarp / rain fly"],
  "👶 Family / Kids": ["Snacks + juice boxes", "Baby wipes (always)", "Kids sunscreen", "Portable white noise machine", "Change of clothes × 2", "First aid kit", "Insect repellent", "Entertainment (tablets, books)", "Stroller / carrier", "Kids' melatonin"],
};

// ─── SHARED HELPERS ──────────────────────────────────────────────────────────

// All users combined (MOCK_USERS + discoverable users). Module-level constant
// since neither array changes at runtime.
const ALL_USERS = [...MOCK_USERS, ...MOCK_DISCOVER];

// Parse a comma-separated tag string into a trimmed, non-empty array.
const parseTags = str => str.split(",").map(t => t.trim()).filter(Boolean);

const STATE_NAMES = {
  "alabama":"AL","alaska":"AK","arizona":"AZ","arkansas":"AR","california":"CA",
  "colorado":"CO","connecticut":"CT","delaware":"DE","florida":"FL","georgia":"GA",
  "hawaii":"HI","idaho":"ID","illinois":"IL","indiana":"IN","iowa":"IA","kansas":"KS",
  "kentucky":"KY","louisiana":"LA","maine":"ME","maryland":"MD","massachusetts":"MA",
  "michigan":"MI","minnesota":"MN","mississippi":"MS","missouri":"MO","montana":"MT",
  "nebraska":"NE","nevada":"NV","new hampshire":"NH","new jersey":"NJ","new mexico":"NM",
  "new york":"NY","north carolina":"NC","north dakota":"ND","ohio":"OH","oklahoma":"OK",
  "oregon":"OR","pennsylvania":"PA","rhode island":"RI","south carolina":"SC",
  "south dakota":"SD","tennessee":"TN","texas":"TX","utah":"UT","vermont":"VT",
  "virginia":"VA","washington":"WA","west virginia":"WV","wisconsin":"WI","wyoming":"WY"
};

// Returns true if entry matches a lowercase search query against name/city/state/cuisine.
// Returns true if the destination conventionally uses miles (US, UK, Myanmar, Liberia).
function usesImperial(destination) {
  const d = (destination || "").toLowerCase();
  const usStates = [", al",", ak",", az",", ar",", ca",", co",", ct",", de",", fl",", ga",", hi",", id",", il",", in",", ia",", ks",", ky",", la",", me",", md",", ma",", mi",", mn",", ms",", mo",", mt",", ne",", nv",", nh",", nj",", nm",", ny",", nc",", nd",", oh",", ok",", or",", pa",", ri",", sc",", sd",", tn",", tx",", ut",", vt",", va",", wa",", wv",", wi",", wy",", dc"];
  if (usStates.some(s => d.includes(s))) return true;
  return ["usa","united states","united kingdom","uk","england","scotland","wales","northern ireland","myanmar","burma","liberia"].some(k => d.includes(k));
}

// State matching supports both abbreviation ("CO") and full name ("colorado").
function entryMatchesSearch(e, q) {
  const stateAbbr = (e.state || "").toLowerCase();
  const fullStateName = Object.keys(STATE_NAMES).find(k => STATE_NAMES[k] === e.state) || "";
  const stateMatches = stateAbbr.includes(q) || fullStateName.includes(q);
  return e.name.toLowerCase().includes(q) ||
    e.city?.toLowerCase().includes(q) ||
    stateMatches ||
    (e.cuisine || "").toLowerCase().includes(q);
}

// Normalise and bulk-import all places from a trip plan into the user's log.
function importTripToLogs(trip, setEntries, setImportToLogsMsg) {
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
  setEntries(prev => [...tripEntries, ...prev]);
  setImportToLogsMsg("✓ Imported " + tripEntries.length + " place" + (tripEntries.length !== 1 ? "s" : "") + " to My Logs!");
  setTimeout(() => setImportToLogsMsg(""), 3000);
}

// Normalise and import a single trip entry into the user's log.
// eslint-disable-next-line no-unused-vars
function importSingleEntry(entry, setEntries, setImportToLogsMsg) {
  setEntries(prev => [{
    ...entry,
    id: "imp_" + (entry.id || "") + "_" + Date.now(),
    userId: "u1",
    verdict: entry.verdict || "must_go",
    rating: entry.rating || 0,
    notes: entry.notes || "",
    tags: entry.tags || [],
    photos: [],
    type: entry.type || "activity"
  }, ...prev]);
  setImportToLogsMsg("✓ Added " + entry.name + " to My Logs!");
  setTimeout(() => setImportToLogsMsg(""), 2500);
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5 MB

// ─── DAY MAP + COPY BUTTONS ───────────────────────────────────────────────────
const MAP_CAP = 10;
function DayMapButton({ day }) {
  const [copied, setCopied] = useState(false);
  const places = (day.entries || day.items || []);
  const capped = places.slice(0, MAP_CAP);

  const mapUrl = "https://www.google.com/maps/dir/" +
    capped.map(e => encodeURIComponent((e.name || "") + (e.city ? " " + e.city : ""))).join("/");

  const copyText = (day.name || ("Day " + day.day)) + "\n" +
    capped.map((e, i) => `${i + 1}. ${e.name}${e.city ? " — " + e.city : ""}${e.note || e.notes ? " (" + (e.note || e.notes) + ")" : ""}`).join("\n") +
    (places.length > MAP_CAP ? `\n(+ ${places.length - MAP_CAP} more)` : "");

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (places.length === 0) return null;
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
      <a href={mapUrl} target="_blank" rel="noopener noreferrer"
        style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f0f0f0", border: "none",
          borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#555", textDecoration: "none",
          cursor: "pointer" }}
        title={places.length > MAP_CAP ? `Map shows first ${MAP_CAP} places` : undefined}>
        🗺 Map{places.length > MAP_CAP ? ` (${MAP_CAP})` : ""}
      </a>
      <button onClick={handleCopy}
        style={{ display: "inline-flex", alignItems: "center", gap: 5, background: copied ? "#e8f5e9" : "#f0f0f0",
          border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11,
          color: copied ? "#2e7d32" : "#555", cursor: "pointer" }}>
        {copied ? "✓ Copied" : "📋 Copy"}
      </button>
      {places.length > MAP_CAP && (
        <span style={{ fontSize: 11, color: "#aaa", alignSelf: "center" }}>
          Map shows first {MAP_CAP} of {places.length} places
        </span>
      )}
    </div>
  );
}

// ─── PHOTO GALLERY BUTTON + FULLSCREEN ───────────────────────────────────────
function PhotoStrip({ photos = [], inline = false }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const count = photos.length;
  const hasPhotos = count > 0;

  return (
    <>
      <button
        onClick={e => { e.stopPropagation(); if (hasPhotos) { setCurrent(0); setOpen(true); } }}
        disabled={!hasPhotos}
        style={{
          background: hasPhotos ? "#f8f8f8" : "#fafafa",
          border: `1px solid ${hasPhotos ? "#efefef" : "#f0f0f0"}`,
          borderRadius: 8,
          padding: inline ? "6px 14px" : "7px 14px",
          fontSize: 13,
          color: hasPhotos ? "#555" : "#bbb",
          cursor: hasPhotos ? "pointer" : "default",
          display: "inline-flex", alignItems: "center", gap: 6
        }}>
        🖼 {count > 0 ? `${count} Photo${count !== 1 ? "s" : ""}` : "Photos"}
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
            color: s <= value ? "#e8c84a" : "#ddd", transition: "color 0.15s" }}>★</span>
      ))}
    </div>
  );
}

// ─── VERDICT BADGE ───────────────────────────────────────────────────────────
function VerdictBadge({ verdict }) {
  const config = verdict === "must_go"
    ? { label: "MUST GO", bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" }
    : { label: "SKIP IT", bg: "#fee2e2", color: "#dc2626", border: "#fecaca" };
  return (
    <span style={{
      background: config.bg, color: config.color, border: `1px solid ${config.border}`,
      borderRadius: "20px", padding: "2px 9px", fontSize: "10px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: 700, letterSpacing: "0.06em"
    }}>{config.label}</span>
  );
}

// ─── ENTRY CARD ──────────────────────────────────────────────────────────────
function EntryCard({ entry, user, compact = false, onEdit, onTogglePrivate, isPrivate, onAddPhoto, onRateInline }) {
  const typeIcon = { restaurant: "🍽", hotel: "🏨", brewery: "🍺", activity: "🏔", cafe: "☕" }[entry.type] || "📍";
  return (
    <div style={{
      background: "#fff", border: "1px solid #efefef", borderRadius: "14px",
      padding: compact ? "14px 16px" : "18px 20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 0 0 0 transparent",
      transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
      cursor: "default"
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#ddd"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "#efefef"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 16 }}>{typeIcon}</span>
            <a href={`https://www.google.com/maps/search/${encodeURIComponent(entry.name + ' ' + (entry.city || ''))}`}
              target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ color: "#000", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: compact ? 15 : 17, fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.textDecoration = "underline"; e.currentTarget.querySelector('span').style.color = "#1a73e8"; }}
              onMouseLeave={e => { e.currentTarget.style.textDecoration = "none"; e.currentTarget.querySelector('span').style.color = "#4285f4"; }}>
              {entry.name} <span style={{ color: "#4285f4", fontSize: compact ? 12 : 13, fontWeight: 400 }}>↗</span>
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
        <div style={{ marginTop: 8, color: "#555", fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
          ✦ {entry.dish}
        </div>
      )}
      {entry.notes && !compact && (
        <div style={{ marginTop: 8, color: "#999", fontSize: 13, lineHeight: 1.5, fontStyle: "italic" }}>
          "{entry.notes}"
        </div>
      )}
      {entry.privateNote && !compact && (
        <div style={{ marginTop: 8, background: "#f0f7ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "8px 12px" }}>
          <span style={{ color: "#3b82f6", fontSize: 10, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.08em", fontWeight: 700 }}>🔒 PRIVATE NOTE</span>
          <div style={{ color: "#3b82f6", fontSize: 12, marginTop: 3, lineHeight: 1.5 }}>{entry.privateNote}</div>
        </div>
      )}
      {user && (
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, borderTop: "1px solid #efefef", paddingTop: 10 }}>
          <span style={{ fontSize: 14 }}>{user.avatar}</span>
          <span
            onClick={e => { e.stopPropagation(); user.onViewProfile && user.onViewProfile(user.id); }}
            style={{ color: "#555", fontSize: 11, cursor: user.onViewProfile ? "pointer" : "default",
              textDecoration: user.onViewProfile ? "underline" : "none" }}>
            @{user.username}
          </span>
          <div style={{ marginLeft: 4, display: "flex", gap: 4 }}>
            {user.tags.slice(0,1).map(t => <TravelerTag key={t} tag={t} />)}
          </div>
        </div>
      )}

      {/* Edit / Private / Photo / Gallery buttons */}
      {!compact && (onEdit || onAddPhoto) && (
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {onRateInline && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 11, color: "#aaa" }}>Rate:</span>
              {[1,2,3,4,5].map(s => (
                <span key={s} onClick={e => { e.stopPropagation(); onRateInline(s); }}
                  style={{ fontSize: 18, cursor: "pointer", color: s <= entry.rating ? "#e8c84a" : "#ddd",
                    transition: "color 0.1s", lineHeight: 1 }}>★</span>
              ))}
            </div>
          )}
          {onEdit && (
            <button onClick={e => { e.stopPropagation(); onEdit(); }}
              style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8, padding: "6px 14px",
                color: "#555", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              ✏️ Edit
            </button>
          )}
          {onTogglePrivate && (
            <button onClick={e => { e.stopPropagation(); onTogglePrivate(); }}
              style={{ background: isPrivate ? "#eff6ff" : "#f8f8f8",
                border: `1px solid ${isPrivate ? "#bfdbfe" : "#efefef"}`,
                borderRadius: 8, padding: "6px 14px",
                color: isPrivate ? "#3b82f6" : "#555", fontSize: 12, cursor: "pointer" }}>
              {isPrivate ? "🔒 Private" : "🌐 Public"}
            </button>
          )}
          {onAddPhoto && (
            <label style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8, padding: "6px 14px",
              color: "#555", fontSize: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
              📷 Photo
              <input type="file" accept="image/*" style={{ display: "none" }} onClick={e => e.stopPropagation()}
                onChange={e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => onAddPhoto(ev.target.result);
                  reader.readAsDataURL(file);
                  e.target.value = "";
                }} />
            </label>
          )}
          <PhotoStrip photos={entry.photos || []} inline />
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

// eslint-disable-next-line no-unused-vars
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
          onMouseEnter={e => { e.currentTarget.style.textDecoration = "underline"; e.currentTarget.querySelector('span').style.color = "#1a73e8"; }}
          onMouseLeave={e => { e.currentTarget.style.textDecoration = "none"; e.currentTarget.querySelector('span').style.color = "#4285f4"; }}>
          {activity.name} <span style={{ color: "#4285f4", fontSize: compact ? 12 : 13, fontWeight: 400 }}>↗</span>
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
              <div style={{ color: "#000", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 13, fontWeight: 600 }}>{activity.distance}</div>
              <div style={{ color: "#555", fontSize: 10, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>DISTANCE</div>
            </div>
          )}
          {activity.elevation && (
            <div>
              <div style={{ color: "#000", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 13, fontWeight: 600 }}>{activity.elevation}</div>
              <div style={{ color: "#555", fontSize: 10, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>ELEVATION</div>
            </div>
          )}
          {activity.elevGain && (
            <div>
              <div style={{ color: "#000", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 13, fontWeight: 600 }}>{activity.elevGain}</div>
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
          <span
            onClick={e => { e.stopPropagation(); user.onViewProfile && user.onViewProfile(user.id); }}
            style={{ color: "#555", fontSize: 11, cursor: user.onViewProfile ? "pointer" : "default",
              textDecoration: user.onViewProfile ? "underline" : "none" }}>
            @{user.username}
          </span>
          <div style={{ marginLeft: 4, display: "flex", gap: 4 }}>
            {user.tags.slice(0,1).map(t => <TravelerTag key={t} tag={t} />)}
          </div>
        </div>
      )}

      {/* Edit / Private / Photo / Gallery */}
      {!compact && (onEdit || onAddPhoto) && (
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {onEdit && (
            <button onClick={e => { e.stopPropagation(); onEdit(); }}
              style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8, padding: "6px 14px",
                color: "#555", fontSize: 12, cursor: "pointer" }}>
              ✏️ Edit
            </button>
          )}
          {onTogglePrivate && (
            <button onClick={e => { e.stopPropagation(); onTogglePrivate(); }}
              style={{ background: isPrivate ? "#eff6ff" : "#f8f8f8",
                border: `1px solid ${isPrivate ? "#bfdbfe" : "#efefef"}`,
                borderRadius: 8, padding: "6px 14px",
                color: isPrivate ? "#3b82f6" : "#555", fontSize: 12, cursor: "pointer" }}>
              {isPrivate ? "🔒 Private" : "🌐 Public"}
            </button>
          )}
          {onAddPhoto && (
            <label style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8, padding: "6px 14px",
              color: "#555", fontSize: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
              📷 Photo
              <input type="file" accept="image/*" style={{ display: "none" }} onClick={e => e.stopPropagation()}
                onChange={e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => onAddPhoto(ev.target.result);
                  reader.readAsDataURL(file);
                  e.target.value = "";
                }} />
            </label>
          )}
          <PhotoStrip photos={activity.photos || []} inline />
        </div>
      )}
    </div>
  );
}

// ─── ADD ENTRY MODAL ─────────────────────────────────────────────────────────
function AddEntryModal({ onClose, onSave, entries, prefill }) {
  const [form, setForm] = useState({
    name: prefill?.name || "",
    city: prefill?.city || "",
    state: prefill?.state || "",
    country: prefill?.country || "USA",
    type: prefill?.type || "restaurant",
    cuisine: prefill?.cuisine || "",
    dish: prefill?.dish || "",
    rating: prefill?.rating || 0,
    verdict: prefill?.verdict || "must_go",
    notes: prefill?.notes || prefill?.note || "",
    privateNote: "",
    tags: (prefill?.tags || []).join(", "),
    isPrivate: false
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [photos, setPhotos] = useState([]);
  const locationBiasRef = useRef(null); // { lat, lon } from CitySearch

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

  const nameDebounceRef = useRef(null);
  const nameInputRef = useRef(null);
  const [nameDropPos, setNameDropPos] = useState({ top: 0, left: 0, width: 0 });

  const OSM_TYPE_MAP = { restaurant: "restaurant", fast_food: "restaurant", food_court: "restaurant", bar: "brewery", pub: "brewery", brewery: "brewery", cafe: "cafe", coffee_shop: "cafe", park: "activity", nature_reserve: "activity", hiking: "activity", sports_centre: "activity", fitness_centre: "activity", attraction: "activity", viewpoint: "activity", museum: "activity" };

  const handleNameChange = (val) => {
    setForm(f => ({ ...f, name: val }));
    clearTimeout(nameDebounceRef.current);
    if (val.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    // Local matches first
    const q = val.toLowerCase();
    const localMatches = Object.entries(KNOWN_PLACES)
      .filter(([key]) => key.includes(q))
      .map(([, place]) => place)
      .filter((v, i, arr) => arr.findIndex(x => x.name === v.name) === i)
      .slice(0, 3);
    if (localMatches.length > 0) { setSuggestions(localMatches); setShowSuggestions(true); }
    // Then fetch from photon
    nameDebounceRef.current = setTimeout(() => {
      const bias = locationBiasRef.current;
      const biasParam = bias ? `&lat=${bias.lat}&lon=${bias.lon}` : "";
      fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(val)}&limit=8${biasParam}`)
        .then(r => r.json())
        .then(data => {
          const seen = new Set(localMatches.map(m => m.name.toLowerCase()));
          const apiMatches = (data.features || [])
            .filter(f => f.properties.name)
            .map(f => {
              const p = f.properties;
              const type = OSM_TYPE_MAP[p.osm_value] || "restaurant";
              const city = p.city || p.town || p.village || "";
              const state = p.state || "";
              const country = p.country || "";
              return { name: p.name, city, state, country, type, cuisine: p.osm_value || "" };
            })
            .filter(r => { const k = r.name.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; })
            .slice(0, 6);
          const all = [...localMatches, ...apiMatches];
          setSuggestions(all);
          setShowSuggestions(all.length > 0);
          if (nameInputRef.current) {
            const rect = nameInputRef.current.getBoundingClientRect();
            setNameDropPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
          }
        })
        .catch(() => {});
    }, 350);
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
        style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10,
          padding: "11px 12px", color: "#000", fontSize: 14,
          marginTop: 4, boxSizing: "border-box", outline: "none" }} />
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 20, padding: "28px 28px 24px", width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto", animation: "slideUp 0.22s ease", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#000", margin: 0, fontSize: 20, fontWeight: 700 }}>{prefill ? "Review & Log" : "Log a Place"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>



        <div style={{ height: 1, background: "#f0f0f0", marginBottom: 20 }} />

        <CitySearch onSelect={({ city, state, country, lat, lon }) => {
          setForm(f => ({ ...f, city, state, country }));
          locationBiasRef.current = { lat, lon };
        }} />

        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#666", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>Place Name</label>
          <input ref={nameInputRef} value={form.name} onChange={e => handleNameChange(e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => form.name.length >= 2 && setShowSuggestions(true)}
            onKeyDown={e => e.key === "Escape" && setShowSuggestions(false)}
            placeholder="Search restaurant, café, park, trail…"
            autoComplete="off"
            style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10,
              padding: "11px 12px", color: "#000", fontSize: 14, marginTop: 4,
              boxSizing: "border-box", outline: "none" }} />
          {form.name.length >= 2 && showSuggestions && createPortal(
            <div style={{ position: "absolute", top: nameDropPos.top + 4, left: nameDropPos.left, width: nameDropPos.width,
              background: "#fff", border: "1px solid #efefef", borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)", zIndex: 99999, overflow: "hidden" }}>
              {suggestions.map((s, i) => (
                <div key={i} onMouseDown={() => selectSuggestion(s)}
                  style={{ padding: "12px 14px", cursor: "pointer", borderBottom: "1px solid #f5f5f5",
                    display: "flex", alignItems: "center", gap: 10 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8f8f8"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <span style={{ fontSize: 18 }}>{{ restaurant:"🍽", brewery:"🍺", cafe:"☕", activity:"🏔" }[s.type] || "📍"}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#000" }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{[s.city, s.state].filter(Boolean).join(", ")}{s.cuisine ? ` · ${s.cuisine}` : ""}</div>
                  </div>
                </div>
              ))}
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
            </div>,
            document.body
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>City</label>
            <input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))}
              style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                padding: "10px 12px", color: "#000", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }} />
          </div>
          <div>
            <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>State</label>
            <input value={form.state} onChange={e => setForm(f => ({...f, state: e.target.value}))}
              style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                padding: "10px 12px", color: "#000", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }} />
          </div>
          <div>
            <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Country</label>
            <input value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))}
              style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                padding: "10px 12px", color: "#000", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }} />
          </div>
        </div>

        <div style={{ marginTop: 14, marginBottom: 14 }}>
          <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Type</label>
          <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
            {["restaurant","hotel","brewery","cafe","activity"].map(t => (
              <button key={t} onClick={() => setForm(f => ({...f, type: t}))}
                style={{ background: form.type === t ? "#000" : "#f8f8f8",
                  border: `1px solid ${form.type === t ? "#000" : "#efefef"}`,
                  color: form.type === t ? "#fff" : "#555",
                  borderRadius: 6, padding: "6px 12px", cursor: "pointer",
                  fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", textTransform: "capitalize" }}>
                {{ restaurant: "🍽", hotel: "🏨", brewery: "🍺", cafe: "☕", activity: "🏔" }[t]} {t}
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
                style={{ flex: 1, background: form.verdict === v ? c + "22" : "#f8f8f8",
                  border: `1px solid ${form.verdict === v ? c : "#efefef"}`,
                  color: form.verdict === v ? c : "#555",
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
            style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
              padding: "10px 12px", color: "#000", fontSize: 13, marginTop: 4,
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
                <div key={photo.slice(-20)} style={{ position: "relative" }}>
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
                const valid = Array.from(e.target.files).filter(
                  f => ALLOWED_IMAGE_TYPES.includes(f.type) && f.size <= MAX_PHOTO_SIZE
                );
                const results = [];
                let loaded = 0;
                if (!valid.length) return;
                valid.forEach((file, idx) => {
                  const reader = new FileReader();
                  reader.onload = ev => {
                    results[idx] = ev.target.result;
                    loaded++;
                    if (loaded === valid.length) {
                      setPhotos(p => [...p, ...results]);
                    }
                  };
                  reader.onerror = () => { loaded++; };
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
            tags: parseTags(form.tags)
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

// ─── LOCATION SEARCH (Log a Place) ──────────────────────────────────────────
function CitySearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const fetchSuggestions = (q) => {
    if (!q || q.length < 2) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6&layer=city&layer=county&layer=state&layer=country`)
      .then(r => r.json())
      .then(data => {
        const seen = new Set();
        const results = (data.features || []).map(f => {
          const p = f.properties;
          const [lon, lat] = f.geometry.coordinates;
          const city = p.name;
          const state = p.state || "";
          const country = p.country || "";
          const label = [city, state, country].filter(Boolean).join(", ");
          return { label, city, state, country, lat, lon };
        }).filter(r => {
          if (!r.label || seen.has(r.label)) return false;
          seen.add(r.label); return true;
        });
        setSuggestions(results);
        if (results.length > 0 && inputRef.current) {
          const rect = inputRef.current.getBoundingClientRect();
          setDropPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
        }
        setOpen(results.length > 0);
      })
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSelected(false);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(e.target.value), 350);
  };

  const handleSelect = (item) => {
    setQuery(item.label);
    setSelected(true);
    onSelect(item);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>City / Area <span style={{ color: "#bbb", fontWeight: 400 }}>— pick first to narrow place search</span></label>
      <div style={{ position: "relative" }}>
        <input ref={inputRef} value={query} onChange={handleChange}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onFocus={() => suggestions.length > 0 && !selected && setOpen(true)}
          placeholder="e.g. Denver, Tokyo, Paris…"
          autoComplete="off"
          style={{ width: "100%", background: selected ? "#f0fdf4" : "#f8f8f8",
            border: `1px solid ${selected ? "#86efac" : "#efefef"}`, borderRadius: 8,
            padding: "10px 12px", color: "#000", fontSize: 14, marginTop: 4,
            boxSizing: "border-box", outline: "none" }}
        />
        {loading && <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "#aaa" }}>...</span>}
        {selected && <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#22c55e" }}>✓</span>}
      </div>
      {open && suggestions.length > 0 && createPortal(
        <div style={{ position: "fixed", top: dropPos.top + 4, left: dropPos.left, width: dropPos.width,
          background: "#fff", border: "1px solid #efefef", borderRadius: 8, zIndex: 99999,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)", overflow: "hidden" }}>
          {suggestions.map((s, i) => (
            <div key={i} onMouseDown={() => handleSelect(s)}
              style={{ padding: "10px 14px", fontSize: 13, color: "#222", cursor: "pointer",
                borderBottom: i < suggestions.length - 1 ? "1px solid #f5f5f5" : "none" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8f8f8"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              📍 {s.label}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── DESTINATION AUTOCOMPLETE ────────────────────────────────────────────────
function DestinationAutocomplete({ value, onChange, onSelect, placeholder, style }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const fetchSuggestions = (q) => {
    if (!q || q.length < 2) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=8&layer=city&layer=county&layer=district&layer=state&layer=country`)
      .then(r => r.json())
      .then(data => {
        const seen = new Set();
        const results = (data.features || [])
          .map(f => {
            const p = f.properties;
            const parts = [p.city || p.name];
            if (p.state && p.state !== parts[0]) parts.push(p.state);
            if (p.country && p.country !== parts[0]) parts.push(p.country);
            return parts.filter(Boolean).join(", ");
          })
          .filter(label => { if (seen.has(label)) return false; seen.add(label); return true; });
        setSuggestions(results);
        if (results.length > 0 && inputRef.current) {
          const r = inputRef.current.getBoundingClientRect();
          setDropPos({ top: r.bottom, left: r.left, width: r.width });
        }
        setOpen(results.length > 0);
      })
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(e.target.value), 350);
  };

  const handleSelect = (label) => {
    onChange(label);
    onSelect && onSelect(label);
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <input ref={inputRef} value={value} onChange={handleChange}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder || "City, country..."}
        style={style}
        autoComplete="off"
      />
      {loading && <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "#aaa" }}>...</span>}
      {open && suggestions.length > 0 && createPortal(
        <div style={{ position: "fixed", top: dropPos.top + 4, left: dropPos.left, width: dropPos.width,
          background: "#fff", border: "1px solid #efefef", borderRadius: 8, zIndex: 99999,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)", overflow: "hidden" }}>
          {suggestions.map((s, i) => (
            <div key={i} onMouseDown={() => handleSelect(s)}
              style={{ padding: "10px 14px", fontSize: 13, color: "#222", cursor: "pointer", borderBottom: i < suggestions.length - 1 ? "1px solid #f5f5f5" : "none" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8f8f8"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              {s}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

// ─── TRIP PLANNER MODAL ──────────────────────────────────────────────────────

function TripPlannerModal({ entries, onClose, onSaveTrip, savedTrips, onUpdateTrip, editTrip }) {
  const isEditing = !!editTrip;
  const [mode, setMode] = useState(isEditing ? "manual" : null); // null | "quick" | "manual"
  const [step, setStep] = useState(0);

  const [prefs, setPrefs] = useState({ destination: "Colorado", days: 3, kids: false, types: [], invitedFriends: [], startDate: "", endDate: "" });
  const [plan, setPlan] = useState(null);
  // Manual plan state — pre-fill from editTrip if editing
  const [manualDestination, setManualDestination] = useState(isEditing ? (editTrip.destination || "") : "");
  const [manualDays, setManualDays] = useState(isEditing ? String(editTrip.days || 3) : "3");
  const [manualStartDate, setManualStartDate] = useState(isEditing ? (editTrip.startDate || "") : "");
  const [manualEndDate, setManualEndDate] = useState(isEditing ? (editTrip.endDate || "") : "");
  const [manualSections, setManualSections] = useState(() => {
    if (isEditing && editTrip.plan?.days?.length) {
      return editTrip.plan.days.map((d, i) => ({
        id: "s" + (i + 1),
        name: d.name || d.activity || `Day ${i + 1}`,
        notes: d.sectionNotes || d.notes || "",
        items: (d.entries || d.items || []).map(e => ({ ...e }))
      }));
    }
    return Array.from({ length: 3 }, (_, i) => ({ id: "s" + (i + 1), name: `Day ${i + 1}`, items: [] }));
  });
  const [manualSearch, setManualSearch] = useState("");
  const [manualNotes, setManualNotes] = useState(isEditing ? (editTrip.notes || "") : "");
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState("");
  const [manualGenerated, setManualGenerated] = useState(false);
  const [googlePlacesResults, setGooglePlacesResults] = useState([]);
  const [googlePlacesLoading, setGooglePlacesLoading] = useState(false);
  const searchDebounceRef = useRef(null);

  const CITIES = [...new Set(entries.map(e => e.city))];


  const generateFromManualNotes = async () => {
    if (!manualNotes.trim()) return;
    setManualLoading(true);
    setManualError("");
    try {
      const n = parseInt(manualDays) || 3;
      const dest = manualDestination || "the destination";
      const distUnit = usesImperial(dest) ? "miles" : "km";
      const distLabel = distUnit === "miles" ? "mi" : "km";
      // Include any places already manually added to sections
      const existingPlaces = manualSections
        .flatMap(s => (s.items || []).map(item => `${item.name}${item.city ? " (" + item.city + ")" : ""} — already assigned to ${s.name}`))
        .join("\n");

      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 3500,
          messages: [{
            role: "user",
            // User content is bracketed in XML tags so injected text cannot
            // break out of the <user_notes> context and override instructions.
            content: `You are an expert travel itinerary planner. Build a ${n}-day trip to ${dest} using the user's notes below.

Instructions:
1. Extract every place, restaurant, bar, attraction, or activity mentioned in the notes.
2. Group places by neighborhood or geographic area — places within walking distance or a short drive belong on the same day to minimize driving.
3. Name each day after its area: "Day 1 — Downtown & LoDo", "Day 2 — RiNo & Five Points", etc.
4. Order days logically as a loop: start near the arrival area, explore outward, end near departure.
5. 3–5 places per day, ordered by time of day: breakfast → lunch → afternoon activity → dinner → bar/evening.
6. For each place infer: type (restaurant/cafe/brewery/bar/hotel/activity/hiking/shopping), cuisine if food, city if mentioned.
7. If the user says "must go" or "highly recommend" for a place, set verdict to "must_go". Otherwise use "want_to_try".
8. If the user specifies a day for a place ("on day 2, go to X"), honor it.
9. If a city isn't mentioned for a place, default to ${dest}.
10. Do not invent places not mentioned in the notes.${existingPlaces ? `\n11. These places are already in the plan — incorporate them into the appropriate day:\n${existingPlaces}` : ""}
11. For every place EXCEPT the first in each day, estimate the travel distance from the previous stop using ${distUnit} (e.g. "0.8 ${distLabel}") and approximate travel mode + time (e.g. "10 min walk" or "5 min drive"). Set distanceFromPrev and travelTimeFromPrev. Leave both null for the first place of each day.

User notes:
<user_notes>${manualNotes}</user_notes>

Return ONLY valid JSON — no explanation, no markdown fences, no backticks. Schema:
{"days":[{"id":"s1","name":"Day 1 — Neighborhood Name","items":[{"id":"i1_1","name":"Place Name","type":"restaurant","note":"short tip from the notes","city":"City Name","state":"CO","verdict":"must_go","cuisine":"Italian","distanceFromPrev":null,"travelTimeFromPrev":null}]}]}`
          }]
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.[0]?.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("AI response didn't contain valid JSON. Try simplifying your notes.");
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.days && parsed.days.length > 0) {
        setManualSections(parsed.days.map((d, i) => ({
          id: d.id || ("s" + (i + 1)),
          name: d.name || `Day ${i + 1}`,
          notes: d.notes || d.sectionNotes || "",
          items: (d.items || d.entries || []).map(e => ({
            ...e,
            distanceFromPrev: e.distanceFromPrev || null,
            travelTimeFromPrev: e.travelTimeFromPrev || null
          }))
        })));
        setManualGenerated(true);
      } else {
        throw new Error("AI returned an empty plan. Add more place names to your notes.");
      }
    } catch(err) {
      setManualError("Could not generate itinerary: " + (err.message || "Unknown error"));
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

  const friendEntries = entries;
  const manualSearchResults = manualSearch.trim().length >= 2
    ? friendEntries.filter(e =>
        e.name.toLowerCase().includes(manualSearch.toLowerCase()) ||
        e.city.toLowerCase().includes(manualSearch.toLowerCase()) ||
        e.state?.toLowerCase().includes(manualSearch.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    if (manualSearch.trim().length < 2) { setGooglePlacesResults([]); return; }
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(async () => {
      setGooglePlacesLoading(true);
      const results = await searchGooglePlaces(manualSearch, manualDestination);
      setGooglePlacesResults(results);
      setGooglePlacesLoading(false);
    }, 400);
    return () => clearTimeout(searchDebounceRef.current);
  }, [manualSearch, manualDestination]);

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
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 20, padding: "28px 28px 24px", width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", animation: "slideUp 0.22s ease", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#000", margin: 0, fontSize: 20, fontWeight: 700 }}>
            {!mode ? "Plan a Trip" : mode === "quick" ? (step === 2 ? "Your Trip Plan 🗺" : "Quick Plan") : "Build a Trip"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ height: 1, background: "#f0f0f0", marginBottom: 20 }} />

        {/* Mode selector */}
        {!mode && (
          <div>
            <p style={{ color: "#888", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              How do you want to plan your trip?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => setMode("quick")}
                style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10,
                  padding: "16px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 26, flexShrink: 0 }}>⚡</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#000", marginBottom: 2 }}>Quick Plan</div>
                  <div style={{ fontSize: 13, color: "#888" }}>Auto-generate from your preferences and network picks</div>
                </div>
              </button>
              <button onClick={() => setMode("manual")}
                style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10,
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
              style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16, fontWeight: 500, padding: "4px 0", marginBottom: 16 }}>← Back</button>

            {/* Destination + Days */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Destination</label>
                <DestinationAutocomplete value={manualDestination} onChange={setManualDestination}
                  placeholder="e.g. Denver, Paris..."
                  style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                    padding: "11px 12px", color: "#000", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Days</label>
                <input type="number" min="1" value={manualDays} onChange={e => {
                  const n = parseInt(e.target.value) || 1;
                  setManualDays(e.target.value);
                  // Auto-fill end date when days + start are set
                  if (manualStartDate) {
                    const start = new Date(manualStartDate);
                    start.setDate(start.getDate() + n - 1);
                    setManualEndDate(start.toISOString().split("T")[0]);
                  }
                  if (!manualGenerated) setManualSections(Array.from({length: n}, (_, i) => manualSections[i] || { id: "s" + (i+1), name: `Day ${i+1}`, items: [] }));
                }}
                  placeholder="3"
                  style={{ width: 70, background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                    padding: "11px 12px", color: "#000", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            {/* Start + End date */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Start Date (optional)</label>
                <input type="date" value={manualStartDate} onChange={e => {
                  setManualStartDate(e.target.value);
                  // Auto-fill end date from start + days
                  if (e.target.value && manualDays) {
                    const start = new Date(e.target.value);
                    start.setDate(start.getDate() + (parseInt(manualDays) || 1) - 1);
                    setManualEndDate(start.toISOString().split("T")[0]);
                  }
                }}
                  style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                    padding: "11px 12px", color: "#000", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>End Date (optional)</label>
                <input type="date" value={manualEndDate} onChange={e => {
                  setManualEndDate(e.target.value);
                  // Auto-calculate days from start + end
                  if (manualStartDate && e.target.value) {
                    const diff = Math.round((new Date(e.target.value) - new Date(manualStartDate)) / 86400000) + 1;
                    if (diff > 0) {
                      setManualDays(String(diff));
                      if (!manualGenerated) setManualSections(Array.from({length: diff}, (_, i) => manualSections[i] || { id: "s" + (i+1), name: `Day ${i+1}`, items: [] }));
                    }
                  }
                }}
                  style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                    padding: "11px 12px", color: "#000", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            {/* Notes field + AI generate */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
                Your Notes {manualGenerated ? "(edit & re-generate anytime)" : "(optional)"}
              </label>
              <textarea
                value={manualNotes}
                onChange={e => setManualNotes(e.target.value)}
                placeholder={"Paste restaurant names, neighborhoods, friends' tips, Google Maps saves, or anything — AI will group them geographically into days.\n\nExample:\n- Milk Bar (RiNo) - must go\n- Day 2: Red Rocks amphitheater\n- great brunch spot: Denver Biscuit Co on Colfax"}
                rows={manualGenerated ? 3 : 5}
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
                  {manualLoading ? "AI is organizing…" : manualGenerated ? "✨ Re-generate from Notes" : "✨ Generate Days from Notes"}
                </button>
              )}
              {!manualNotes.trim() && !manualGenerated && (
                <button onClick={() => setManualGenerated(true)}
                  style={{ marginTop: 8, width: "100%", background: "#f8f8f8", border: "1px solid #efefef",
                    borderRadius: 8, padding: "11px", color: "#555", fontSize: 14, cursor: "pointer" }}>
                  Skip — Build Manually
                </button>
              )}
            </div>

            {manualGenerated && (
              <div style={{ marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, color: "#555" }}>✨ AI organized your notes — edit below or re-generate above</div>
                <button onClick={() => { setManualGenerated(false); setManualNotes(""); setManualSections(Array.from({ length: parseInt(manualDays) || 3 }, (_, i) => ({ id: "s" + (i + 1), name: `Day ${i + 1}`, items: [] }))); }}
                  style={{ background: "none", border: "none", color: "#aaa", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
                  Clear all
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
                      <span style={{ fontSize: 16 }}>{{ restaurant:"🍽", brewery:"🍺", cafe:"☕", activity:"🏔" }[e.type] || "📍"}</span>
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
                        <a href={`https://www.google.com/maps/search/${encodeURIComponent(p.name + ' ' + (p.city || ''))}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize: 14, fontWeight: 500, color: "#000", textDecoration: "none", display: "block" }}
                          onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                          onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                          {p.name} <span style={{ color: "#4285f4", fontSize: 12, fontWeight: 400 }}>↗</span>
                        </a>
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
              {googlePlacesLoading && (
                <div style={{ marginTop: 6, fontSize: 12, color: "#888", padding: "8px 0" }}>Searching places…</div>
              )}
              {(manualSearchResults.length > 0 || googlePlacesResults.length > 0) && (
                <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 10, marginTop: 6, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                  {/* Google Places results — shown first */}
                  {googlePlacesResults.map(e => {
                    const typeIcon = { restaurant:"🍽", brewery:"🍺", cafe:"☕", activity:"🏔", hiking:"🥾" }[e.type] || "📍";
                    return (
                      <div key={e.id} style={{ padding: "12px 14px", borderBottom: "1px solid #f5f5f5" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <span style={{ fontSize: 18, lineHeight: 1, marginTop: 1 }}>{typeIcon}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#000", marginBottom: 2 }}>{e.name}</div>
                            <div style={{ fontSize: 12, color: "#888" }}>
                              {e.city}{e.city && e.type ? " · " : ""}{e.type}
                              {e.rating ? <span style={{ marginLeft: 6, color: "#f59e0b", fontWeight: 600 }}>★ {e.rating}</span> : null}
                            </div>
                            {e.notes && <div style={{ fontSize: 11, color: "#bbb", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.notes}</div>}
                          </div>
                          <select onChange={ev => ev.target.value && addToSection(ev.target.value, e)}
                            style={{ background: "#000", color: "#fff", border: "none", borderRadius: 6, padding: "5px 8px", fontSize: 12, cursor: "pointer", flexShrink: 0 }}
                            defaultValue="">
                            <option value="" disabled>+ Add</option>
                            {manualSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                  {/* Network results */}
                  {manualSearchResults.length > 0 && (
                    <>
                      <div style={{ padding: "6px 14px 4px", fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em", borderTop: googlePlacesResults.length > 0 ? "1px solid #f0f0f0" : "none" }}>From your network</div>
                      {manualSearchResults.map(e => {
                        const typeIcon = { restaurant:"🍽", brewery:"🍺", cafe:"☕", activity:"🏔", hiking:"🥾" }[e.type] || "📍";
                        return (
                          <div key={e.id} style={{ padding: "12px 14px", borderBottom: "1px solid #f5f5f5" }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                              <span style={{ fontSize: 18, lineHeight: 1, marginTop: 1 }}>{typeIcon}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: "#000", marginBottom: 2 }}>{e.name}</div>
                                <div style={{ fontSize: 12, color: "#888" }}>
                                  {e.city}{e.city && (e.cuisine || e.type) ? " · " : ""}{e.cuisine || e.type}
                                  {e.rating ? <span style={{ marginLeft: 6, color: "#f59e0b", fontWeight: 600 }}>★ {e.rating}</span> : null}
                                </div>
                              </div>
                              <select onChange={ev => ev.target.value && addToSection(ev.target.value, e)}
                                style={{ background: "#000", color: "#fff", border: "none", borderRadius: 6, padding: "5px 8px", fontSize: 12, cursor: "pointer", flexShrink: 0 }}
                                defaultValue="">
                                <option value="" disabled>+ Add</option>
                                {manualSections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
              {manualSearch.trim().length >= 2 && !googlePlacesLoading && manualSearchResults.length === 0 && googlePlacesResults.length === 0 && (
                <div style={{ marginTop: 6, fontSize: 12, color: "#888" }}>
                  No matches found.{" "}
                  <a href={`https://www.google.com/maps/search/${encodeURIComponent(manualSearch + (manualDestination ? " " + manualDestination : ""))}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ color: "#000", fontWeight: 600, textDecoration: "underline" }}>
                    Search on Google Maps ↗
                  </a>
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
                        <select value={e.type || "activity"}
                          onChange={ev => setManualSections(prev => prev.map(s => s.id !== section.id ? s : {
                            ...s, items: s.items.map((it, j) => j === i ? {...it, type: ev.target.value} : it)
                          }))}
                          style={{ background: "none", border: "none", fontSize: 14, cursor: "pointer", padding: 0, color: "#555" }}>
                          <option value="restaurant">🍽</option>
                          <option value="hotel">🏨</option>
                          <option value="brewery">🍺</option>
                          <option value="cafe">☕</option>
                          <option value="activity">🏔</option>
                          <option value="hiking">🥾</option>
                        </select>
                        <input value={e.name}
                          onChange={ev => setManualSections(prev => prev.map(s => s.id !== section.id ? s : {
                            ...s, items: s.items.map((it, j) => j === i ? {...it, name: ev.target.value} : it)
                          }))}
                          style={{ flex: 1, fontSize: 13, color: "#000", background: "transparent", border: "none",
                            borderBottom: "1px dashed #e0e0e0", outline: "none", padding: "2px 0" }} />
                        <button onClick={() => removeFromSection(section.id, e.id)}
                          style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 14 }}>×</button>
                      </div>
                    ))
                  )}
                  {/* Quick add custom place */}
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <input placeholder="+ Add a place..."
                      style={{ flex: 1, background: "#fff", border: "1px solid #e8e8e8", borderRadius: 6,
                        padding: "6px 10px", fontSize: 12, color: "#000", outline: "none" }}
                      onKeyDown={ev => {
                        if (ev.key === "Enter" && ev.target.value.trim()) {
                          const name = ev.target.value.trim();
                          setManualSections(prev => prev.map(s => s.id !== section.id ? s : {
                            ...s, items: [...s.items, { id: "c_" + Date.now(), name, type: "activity", city: manualDestination, state: "", verdict: "must_go", cuisine: "" }]
                          }));
                          ev.target.value = "";
                        }
                      }} />
                  </div>
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
              const plan = {
                days: manualSections.map((s, i) => ({
                  day: i + 1,
                  city: manualDestination,
                  activity: s.name,
                  name: s.name,
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
              };
              if (isEditing) {
                onUpdateTrip({ ...editTrip, destination: manualDestination, days: manualSections.length,
                  startDate: manualStartDate || null, endDate: manualEndDate || null,
                  notes: manualNotes || "", plan });
              } else {
                onSaveTrip({ id: "t" + Date.now(), destination: manualDestination, days: manualSections.length,
                  kids: false, startDate: manualStartDate || null, endDate: manualEndDate || null,
                  createdAt: new Date().toLocaleDateString(), invitedFriends: [], sharedWith: [],
                  completed: false, notes: manualNotes || "", plan });
              }
              onClose();
            }}
              style={{ width: "100%", background: manualDestination.trim() ? "#000" : "#ccc",
                border: "none", borderRadius: 8, padding: 13,
                color: "#fff", fontSize: 15, fontWeight: 700, cursor: manualDestination.trim() ? "pointer" : "not-allowed" }}>
              {isEditing ? "Save Changes ✓" : "Save Trip ✓"}
            </button>
          </div>
        )}

        {mode === "quick" && step === 0 && (
          <div>
            <button onClick={() => setMode(null)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16, fontWeight: 500, padding: "4px 0", marginBottom: 16 }}>← Back</button>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
              Auto-generate an itinerary using Must Go picks from your network.
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Destination</label>
              <DestinationAutocomplete value={prefs.destination} onChange={v => setPrefs(p => ({...p, destination: v}))}
                style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                  padding: "10px 12px", color: "#000", fontSize: 14, marginTop: 4,
                  boxSizing: "border-box", outline: "none" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>Number of Days</label>
              <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
                <input type="number" min={1} max={100} value={prefs.days}
                  onChange={e => {
                    const d = Math.min(100, Math.max(1, parseInt(e.target.value) || 1));
                    setPrefs(p => {
                      const updated = { ...p, days: d };
                      if (p.startDate) {
                        const start = new Date(p.startDate);
                        start.setDate(start.getDate() + d - 1);
                        updated.endDate = start.toISOString().split("T")[0];
                      }
                      return updated;
                    });
                  }}
                  style={{ width: 80, background: "#f8f8f8", border: "1px solid #efefef",
                    borderRadius: 6, padding: "7px 10px", fontSize: 13, outline: "none", textAlign: "center", color: "#000" }}
                />
              </div>
            </div>
            {/* Start + End date */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: "#666", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Start Date (optional)</label>
                <input type="date" value={prefs.startDate} onChange={e => {
                  const val = e.target.value;
                  setPrefs(p => {
                    const updated = { ...p, startDate: val };
                    if (val && p.days) {
                      const start = new Date(val);
                      start.setDate(start.getDate() + p.days - 1);
                      updated.endDate = start.toISOString().split("T")[0];
                    }
                    return updated;
                  });
                }}
                  style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                    padding: "11px 12px", color: "#000", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: "#666", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>End Date (optional)</label>
                <input type="date" value={prefs.endDate} onChange={e => {
                  const val = e.target.value;
                  setPrefs(p => {
                    const updated = { ...p, endDate: val };
                    if (p.startDate && val) {
                      const diff = Math.round((new Date(val) - new Date(p.startDate)) / 86400000) + 1;
                      if (diff > 0) updated.days = diff;
                    }
                    return updated;
                  });
                }}
                  style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                    padding: "11px 12px", color: "#000", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
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
                {["restaurant","hotel","brewery","cafe","activity"].map(t => (
                  <button key={t} onClick={() => setPrefs(p => ({...p, types: p.types.includes(t) ? p.types.filter(x=>x!==t) : [...p.types, t]}))}
                    style={{ background: prefs.types.includes(t) ? "#000" : "#f8f8f8",
                      border: `1px solid ${prefs.types.includes(t) ? "#000" : "#efefef"}`,
                      color: prefs.types.includes(t) ? "#fff" : "#555",
                      borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12 }}>
                    {{ restaurant: "🍽", hotel: "🏨", brewery: "🍺", cafe: "☕", activity: "🏔" }[t]} {t}
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
                  startDate: prefs.startDate || null,
                  endDate: prefs.endDate || null,
                  createdAt: new Date().toLocaleDateString(),
                  invitedFriends: [],
                  sharedWith: [],
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
  const cities = [...new Set(userEntries.map(e => e.city).filter(Boolean))];
  const [cityFilter, setCityFilter] = useState(null);
  const [profileSearch, setProfileSearch] = useState("");
  const [verdictFilter, setVerdictFilter] = useState("all");

  const verdictTabs = [
    { id: "all",      label: "All",      color: "#555" },
    { id: "must_go",  label: "Must Go",  color: "#E8873A" },
    { id: "liked",    label: "Liked",    color: "#16a34a" },
    { id: "meh",      label: "Meh",      color: "#d97706" },
    { id: "avoid",    label: "Avoid",    color: "#ef4444" },
  ];

  const visibleEntries = userEntries.filter(e => {
    if (verdictFilter !== "all" && e.verdict !== verdictFilter) return false;
    if (cityFilter && e.city !== cityFilter) return false;
    if (profileSearch.trim()) {
      const q = profileSearch.toLowerCase();
      return (e.name||"").toLowerCase().includes(q) || (e.city||"").toLowerCase().includes(q)
        || (e.cuisine||"").toLowerCase().includes(q) || (e.notes||"").toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#555", cursor: "pointer",
        fontSize: 16, fontWeight: 500, marginBottom: 20, padding: "4px 0", display: "flex", alignItems: "center", gap: 4 }}>
        ← Back
      </button>

      {/* Hero card */}
      <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 16,
        padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ width: 60, height: 60, background: "#f0f0f0", border: "2px solid #efefef",
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, flexShrink: 0, overflow: "hidden" }}>
            {user.avatarImg
              ? <img src={user.avatarImg} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : user.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#000", letterSpacing: "-0.02em" }}>{user.name}</div>
            <div style={{ color: "#aaa", fontSize: 12, marginBottom: 10 }}>@{user.username}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {user.tags.map(t => <TravelerTag key={t} tag={t} />)}
            </div>
          </div>
        </div>
        {user.bio && (
          <div style={{ color: "#666", fontSize: 13, marginTop: 14, lineHeight: 1.6, borderTop: "1px solid #f5f5f5", paddingTop: 14 }}>
            {user.bio}
          </div>
        )}
        <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
          {[
            { label: "Logs", value: userEntries.length, action: () => { setVerdictFilter("all"); setCityFilter(null); }, active: verdictFilter === "all" && !cityFilter },
            { label: "Must Go", value: userEntries.filter(e => e.verdict === "must_go").length, action: () => setVerdictFilter(verdictFilter === "must_go" ? "all" : "must_go"), active: verdictFilter === "must_go" },
            { label: "Cities", value: cities.length, action: () => setCityFilter(null), active: !!cityFilter },
            { label: "Trips", value: user.tripsCount, action: null, active: false },
          ].map(({ label, value, action, active }) => (
            <div key={label} onClick={action || undefined} style={{ cursor: action ? "pointer" : "default" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#000" }}>{value}</div>
              <div style={{ fontSize: 11, color: active ? "#000" : "#aaa", fontWeight: active ? 700 : 400, borderBottom: active ? "2px solid #000" : "2px solid transparent", paddingBottom: 1, marginTop: 1, transition: "all 0.15s" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }}>🔍</span>
        <input value={profileSearch} onChange={e => setProfileSearch(e.target.value)}
          placeholder="Search places, city, cuisine..."
          style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10,
            padding: "11px 12px 11px 34px", color: "#000", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        {profileSearch && <button onClick={() => setProfileSearch("")}
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 16 }}>×</button>}
      </div>

      {/* Verdict filter tabs */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
        {verdictTabs.map(v => {
          const count = v.id === "all" ? userEntries.length : userEntries.filter(e => e.verdict === v.id).length;
          const active = verdictFilter === v.id;
          return (
            <button key={v.id} onClick={() => setVerdictFilter(v.id)}
              style={{ background: active ? v.color : "#f8f8f8",
                border: `1.5px solid ${active ? v.color : "#e8e8e8"}`,
                color: active ? "#fff" : v.color === "#555" ? "#555" : v.color,
                borderRadius: 20, padding: "6px 14px", fontSize: 12, cursor: "pointer",
                whiteSpace: "nowrap", flexShrink: 0, fontWeight: active ? 700 : 500,
                display: "flex", alignItems: "center", gap: 5 }}>
              {v.label}
              <span style={{ background: active ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.07)",
                borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* City pills */}
      {cities.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
            Filter by City
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {cityFilter && (
              <button onClick={() => setCityFilter(null)}
                style={{ background: "#f8f8f8", border: "1px solid #ddd", borderRadius: 20, padding: "4px 12px",
                  fontSize: 11, color: "#555", cursor: "pointer" }}>
                ✕ Clear
              </button>
            )}
            {cities.map(c => (
              <button key={c} onClick={() => setCityFilter(cityFilter === c ? null : c)}
                style={{ background: cityFilter === c ? "#000" : "#f8f8f8",
                  border: `1px solid ${cityFilter === c ? "#000" : "#e8e8e8"}`,
                  color: cityFilter === c ? "#fff" : "#444",
                  borderRadius: 20, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>
                📍 {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
        {visibleEntries.length} {verdictFilter === "all" ? "Logs" : verdictFilter.replace("_", " ")} {cityFilter ? `in ${cityFilter}` : ""}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {visibleEntries.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "52px 20px", color: "#aaa", background: "#fafafa", borderRadius: 16, border: "1px dashed #e8e8e8" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#555", marginBottom: 4 }}>No logs match your filters</div>
          </div>
        ) : visibleEntries.map(e => (
          <div key={e.id} style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", height: 120, overflow: "hidden", flexShrink: 0 }}>
              <img src={(e.photos && e.photos.length > 0) ? e.photos[0] : getPlacePhoto(e)} alt={e.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={ev => { ev.target.style.display = "none"; ev.target.parentNode.style.background = "#f0f0f0"; }} />
            </div>
            <div style={{ padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 4 }}>
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(e.name + ' ' + (e.city || ''))}`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={ev => ev.stopPropagation()}
                  style={{ color: "#000", fontSize: 13, fontWeight: 700, textDecoration: "none", lineHeight: 1.3 }}
                  onMouseEnter={ev => ev.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={ev => ev.currentTarget.style.textDecoration = "none"}>
                  {e.name} <span style={{ color: "#4285f4", fontSize: 11, fontWeight: 400 }}>↗</span>
                </a>
                <StarRating value={e.rating} size={11} />
              </div>
              <div style={{ fontSize: 11, color: "#888" }}>
                {e.city}{e.state ? `, ${e.state}` : ""} · {e.cuisine || e.type}
              </div>
              {e.verdict && <VerdictBadge verdict={e.verdict} />}
              {e.notes && (
                <div style={{ fontSize: 11, color: "#999", fontStyle: "italic", lineHeight: 1.4, marginTop: 2 }}>
                  "{e.notes.length > 80 ? e.notes.slice(0, 80) + "…" : e.notes}"
                </div>
              )}
              {savedTrips && savedTrips.filter(t => !t.completed).length > 0 && (
                <div style={{ marginTop: 4 }}>
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

const TYPE_ICON = { restaurant: "🍽", hotel: "🏨", brewery: "🍺", cafe: "☕", activity: "🏔" };
const ACTION_COLOR = { log: "#e8c84a", verdict: "#4ade80", trip: "#60a5fa", dish: "#f4845f" };

// eslint-disable-next-line no-unused-vars
function FeedTab({ entries, friendState, pendingIncoming, setPendingIncoming, setFriendState, onViewProfile, savedTrips, onAddToTrip, currentUserId }) {
  const [filter, setFilter] = useState("all");
  const allUsers = ALL_USERS;
  const friends = allUsers.filter(u => friendState[u.id] === "friend");

  const [locationSearch, setLocationSearch] = useState("");
  const allEntries = useMemo(() => [...MOCK_ENTRIES, ...entries], [entries]);

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
          style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10,
            padding: "10px 12px 10px 34px", color: "#000", fontSize: 13,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = "#000"}
          onBlur={e => e.target.style.borderColor = "#efefef"}
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
            style={{ background: filter === v ? "#000" : "transparent",
              border: `1px solid ${filter === v ? "#000" : "#ddd"}`,
              color: filter === v ? "#fff" : "#555",
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
                        <span style={{ color: "#f5f0e8", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
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
                          <a href={`https://www.google.com/maps/search/${encodeURIComponent(entry.name + ' ' + (entry.city || ''))}`}
                            target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ color: "#f5f0e8", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 15, fontWeight: 600, textDecoration: "none" }}
                            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                            {entry.name} <span style={{ color: "#4285f4", fontSize: 12, fontWeight: 400 }}>↗</span>
                          </a>
                          <VerdictBadge verdict={entry.verdict} />
                        </div>
                        <div style={{ color: "#555", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", marginTop: 4 }}>
                          {entry.city}, {entry.state} · {entry.cuisine || entry.type}
                        </div>
                        {entry.dish && (
                          <div style={{ color: "#555", fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", marginTop: 6 }}>
                            ✦ {entry.dish}
                          </div>
                        )}
                        {entry.notes && (
                          <div style={{ color: "#666", fontSize: 12, marginTop: 6, fontStyle: "italic", lineHeight: 1.5 }}>
                            "{(entry.notes || "").slice(0, 80)}{(entry.notes || "").length > 80 ? "…" : ""}"
                          </div>
                        )}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {(entry.tags || []).slice(0, 3).map(t => (
                              <span key={t} style={{ color: "#888", fontSize: 10,
                                background: "#f5f5f5", borderRadius: 20, padding: "2px 8px" }}>
                                #{t}
                              </span>
                            ))}
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
function NetworkTab({ entries, onViewProfile, friendState, setFriendState, pendingIncoming, setPendingIncoming, currentUser, friendProfiles }) {
  const [search, setSearch] = useState("");
  const [networkSection, setNetworkSection] = useState("friends");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchDebounce = useRef(null);

  const friends = friendProfiles || [];
  const pendingOutgoing = Object.entries(friendState)
    .filter(([, s]) => s === "pending")
    .map(([id]) => ({ id }));

  useEffect(() => {
    if (search.trim().length < 2) { setSearchResults([]); return; }
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(async () => {
      setSearching(true);
      const { data } = await supabase.from("profiles").select("*")
        .or(`username.ilike.%${search.trim()}%,name.ilike.%${search.trim()}%`)
        .neq("id", currentUser?.id)
        .limit(10);
      setSearchResults(data || []);
      setSearching(false);
    }, 350);
  }, [search, currentUser?.id]);

  const sendRequest = async (profileId) => {
    setFriendState(s => ({ ...s, [profileId]: "pending" }));
    await supabase.from("friendships").insert({ user_id: currentUser.id, friend_id: profileId, status: "pending" });
  };

  const cancelRequest = async (profileId) => {
    setFriendState(s => { const n = { ...s }; delete n[profileId]; return n; });
    await supabase.from("friendships").delete().eq("user_id", currentUser.id).eq("friend_id", profileId);
  };

  const acceptRequest = async (req) => {
    await supabase.from("friendships").update({ status: "accepted" }).eq("user_id", req.from).eq("friend_id", currentUser.id);
    setFriendState(s => ({ ...s, [req.from]: "friend" }));
    setPendingIncoming(p => p.filter(r => r.from !== req.from));
    if (req.profile) friendProfiles.push(req.profile);
  };

  const declineRequest = async (req) => {
    await supabase.from("friendships").delete().eq("user_id", req.from).eq("friend_id", currentUser.id);
    setPendingIncoming(p => p.filter(r => r.from !== req.from));
  };

  const getStateBtn = (u) => {
    const state = friendState[u.id];
    if (state === "friend") return (
      <span style={{ color: "#4ade80", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11, background: "#14532d", border: "1px solid #16a34a", borderRadius: 6, padding: "4px 10px" }}>✓ Friends</span>
    );
    if (state === "pending") return (
      <button onClick={e => { e.stopPropagation(); cancelRequest(u.id); }}
        style={{ color: "#555", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11, background: "#f8f8f8", border: "1px solid #ddd", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>
        Pending ✕
      </button>
    );
    return (
      <button onClick={e => { e.stopPropagation(); sendRequest(u.id); }}
        style={{ color: "#000", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11, background: "#f8f8f8", border: "1px solid #ddd", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>
        + Add
      </button>
    );
  };

  const UserRow = ({ user, onClick }) => {
    const userEntries = entries.filter(e => e.userId === user.id);
    const mustGo = userEntries.filter(e => e.verdict === "must_go").length;
    return (
      <div onClick={onClick}
        style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 12, padding: "16px 18px", cursor: "pointer", transition: "border-color 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#000"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#efefef"}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 42, height: 42, background: "#f0f0f0", border: "1px solid #efefef", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
            {user.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div>
                <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#000", fontSize: 16 }}>{user.name}</div>
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
          style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10,
            padding: "12px 14px 12px 38px", color: "#000", fontSize: 14,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", outline: "none", boxSizing: "border-box",
            transition: "border-color 0.2s" }}
          onFocus={e => e.target.style.borderColor = "#000"}
          onBlur={e => e.target.style.borderColor = "#efefef"}
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
            {searching ? "SEARCHING…" : `${searchResults.length} RESULT${searchResults.length !== 1 ? "S" : ""} FOR "${search.toUpperCase()}"`}
          </div>
          {!searching && searchResults.length === 0 ? (
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
                style={{ flex: 1, background: networkSection === id ? "#000" : "transparent",
                  border: "none", borderRadius: 6, padding: "8px 4px", cursor: "pointer",
                  color: networkSection === id ? "#fff" : "#555",
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
                  <div style={{ color: "#000", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", marginBottom: 10 }}>
                    ● {pendingIncoming.length} FRIEND REQUEST{pendingIncoming.length > 1 ? "S" : ""}
                  </div>
                  {pendingIncoming.map(req => (
                    <div key={req.from} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "14px 16px", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 38, height: 38, background: "#f0f0f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                          {req.profile?.avatar || "✈️"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: "#000", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 15 }}>{req.profile?.name || "Traveler"}</div>
                          <div style={{ color: "#555", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11 }}>@{req.profile?.username || req.from}</div>
                        </div>
                        <div style={{ display: "flex", gap: 7 }}>
                          <button onClick={() => acceptRequest(req)}
                            style={{ background: "#4ade8022", border: "1px solid #4ade80", color: "#4ade80", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                            Accept
                          </button>
                          <button onClick={() => declineRequest(req)}
                            style={{ background: "transparent", border: "1px solid #333", color: "#666", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pending outgoing */}
              {pendingOutgoing.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ color: "#555", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", marginBottom: 10 }}>SENT REQUESTS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {pendingOutgoing.map(u => (
                      <div key={u.id} style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18 }}>{u.avatar}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: "#f5f0e8", fontSize: 14, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>{u.name}</div>
                          <div style={{ color: "#555", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>@{u.username}</div>
                        </div>
                        <span style={{ color: "#555", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11, background: "#f8f8f8", border: "1px solid #ddd", borderRadius: 6, padding: "3px 9px" }}>Pending</span>
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
              <div style={{ textAlign: "center", padding: "32px 0", color: "#444", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 13, lineHeight: 1.8 }}>
                Search for travelers by username above<br />
                <span style={{ color: "#666", fontSize: 12 }}>to find and add friends.</span>
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
// eslint-disable-next-line no-unused-vars
function AddDiaryModal({ onClose, onSave, entries }) {
  const [form, setForm] = useState({
    title: "", city: "", state: "", country: "USA",
    dateFrom: "", dateTo: "",
    story: "", budget: "", tags: "",
    linkedEntries: []
  });

  const myPlaces = entries;
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
        style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10,
          padding: "11px 12px", color: "#000", fontSize: 14,
          marginTop: 4, boxSizing: "border-box", outline: "none" }} />
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 20, padding: "28px 28px 24px", width: "100%", maxWidth: 540, maxHeight: "90vh", overflowY: "auto", animation: "slideUp 0.22s ease", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#000", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", margin: 0, fontSize: 20, fontWeight: 700 }}>📖 New Diary Entry</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>

        <div style={{ height: 1, background: "#f0f0f0", marginBottom: 20 }} />

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
            style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
              padding: "10px 12px", color: "#000", fontSize: 13, marginTop: 4,
              boxSizing: "border-box", outline: "none", resize: "vertical",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", lineHeight: 1.6 }} />
        </div>

        {inp("budget", "Budget (optional)", "e.g. $650 (lodging, food, gas)")}

        {/* Link places */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Link Places from My Logs</label>
          <button onClick={() => setShowLinkPicker(!showLinkPicker)}
            style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10, padding: "8px 14px",
              color: "#000", fontSize: 12, cursor: "pointer", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", width: "100%" }}>
            {showLinkPicker ? "▴ Hide" : `▾ Select places (${form.linkedEntries.length} linked)`}
          </button>
          {showLinkPicker && (
            <div style={{ maxHeight: 180, overflowY: "auto", marginTop: 8, background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10, padding: 8 }}>
              {myPlaces.map(p => {
                const linked = form.linkedEntries.includes(p.id);
                return (
                  <div key={p.id} onClick={() => toggleLink(p.id)}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", cursor: "pointer", borderRadius: 6,
                      background: linked ? "#f0f0f0" : "transparent", marginBottom: 2 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 4, border: `1px solid ${linked ? "#000" : "#ccc"}`,
                      background: linked ? "#000" : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, color: "#fff", flexShrink: 0 }}>{linked ? "✓" : ""}</span>
                    <span style={{ color: "#000", fontSize: 13 }}>{p.name}</span>
                    <span style={{ color: "#888", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>{p.city}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {inp("tags", "Tags", "ski trip, date night, solo (comma separated)")}

        {/* Photos placeholder */}
        <div style={{ marginBottom: 18, background: "#f8f8f8", border: "1px dashed #ddd", borderRadius: 10, padding: "14px", textAlign: "center" }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>📸</div>
          <div style={{ color: "#aaa", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 11 }}>PHOTO UPLOAD COMING SOON</div>
        </div>

        <button onClick={() => {
          if (!form.title || !form.city || !form.story) return;
          const newDiary = {
            ...form,
            id: "d" + Date.now(),
            userId: "u1",
            photos: [],
            tags: parseTags(form.tags)
          };
          onSave(newDiary);
          onClose();
        }}
          style={{ width: "100%", background: "#000",
            border: "none", borderRadius: 8, padding: "13px", color: "#fff",
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
        style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10,
          padding: "11px 12px", color: "#000", fontSize: 14,
          marginTop: 4, boxSizing: "border-box", outline: "none" }} />
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 20, padding: "28px 28px 24px", width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto", animation: "slideUp 0.22s ease", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#000", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", margin: 0, fontSize: 20, fontWeight: 700 }}>Edit Log</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>

        <div style={{ height: 1, background: "#f0f0f0", marginBottom: 20 }} />

        {inp("name", "Place Name", "e.g. Rioja")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>City</label>
            <input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))}
              style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10, padding: "11px 12px", color: "#000", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }} />
          </div>
          <div>
            <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>State</label>
            <input value={form.state} onChange={e => setForm(f => ({...f, state: e.target.value}))}
              style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10, padding: "11px 12px", color: "#000", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }} />
          </div>
          <div>
            <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Country</label>
            <input value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))}
              style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10, padding: "11px 12px", color: "#000", fontSize: 14, marginTop: 4, boxSizing: "border-box", outline: "none", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }} />
          </div>
        </div>

        <div style={{ marginTop: 14, marginBottom: 14 }}>
          <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Type</label>
          <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
            {["restaurant","hotel","brewery","cafe","activity"].map(t => (
              <button key={t} onClick={() => setForm(f => ({...f, type: t}))}
                style={{ background: form.type === t ? "#000" : "#f8f8f8",
                  border: `1px solid ${form.type === t ? "#000" : "#efefef"}`,
                  color: form.type === t ? "#fff" : "#555",
                  borderRadius: 6, padding: "6px 12px", cursor: "pointer",
                  fontSize: 12, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", textTransform: "capitalize" }}>
                {{"restaurant":"🍽","hotel":"🏨","brewery":"🍺","cafe":"☕","activity":"🏔"}[t]} {t}
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
                style={{ flex: 1, background: form.verdict === v ? c + "22" : "#f8f8f8",
                  border: `1px solid ${form.verdict === v ? c : "#efefef"}`,
                  color: form.verdict === v ? c : "#555",
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
            style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
              padding: "10px 12px", color: "#000", fontSize: 13, marginTop: 4,
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
                <div key={photo.slice(-20)} style={{ position: "relative" }}>
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
                const valid = Array.from(e.target.files).filter(
                  f => ALLOWED_IMAGE_TYPES.includes(f.type) && f.size <= MAX_PHOTO_SIZE
                );
                const results = [];
                let loaded = 0;
                if (!valid.length) return;
                valid.forEach((file, idx) => {
                  const reader = new FileReader();
                  reader.onload = ev => {
                    results[idx] = ev.target.result;
                    loaded++;
                    if (loaded === valid.length) {
                      setPhotos(p => [...p, ...results]);
                    }
                  };
                  reader.onerror = () => { loaded++; };
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
              tags: parseTags(form.tags)
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



// ─── TRIP MAP MODAL ──────────────────────────────────────────────────────────
// Geocoding cache — persists across modal opens within the session
const _geocodeCache = {};

// Raw Nominatim fetch (cached by query string)
async function _fetchNominatim(query) {
  if (_geocodeCache[query] !== undefined) return _geocodeCache[query];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    const result = data[0] ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) } : null;
    _geocodeCache[query] = result;
    return result;
  } catch {
    _geocodeCache[query] = null;
    return null;
  }
}

// Small random jitter so stacked city-level pins spread out slightly
function _jitter(coord) {
  const spread = 0.012; // ~1 km
  return {
    lat: coord.lat + (Math.random() - 0.5) * spread,
    lng: coord.lng + (Math.random() - 0.5) * spread,
    approximate: true,
  };
}

// Geocode an entry: try specific name first, fall back to city+state
async function geocodeEntry(entry) {
  const { name, city, state, country } = entry;
  // 1. Try full place name
  const fullQuery = [name, city, state, country].filter(Boolean).join(", ");
  const exact = await _fetchNominatim(fullQuery);
  if (exact) return { ...exact, approximate: false };

  // 2. Fall back to city + state (or city + country)
  const cityQuery = [city, state, country].filter(Boolean).join(", ");
  if (!cityQuery) return null;
  const cityCoord = await _fetchNominatim(cityQuery);
  if (cityCoord) return _jitter(cityCoord);

  return null;
}

// Day palette — 8 distinct colors
const DAY_COLORS = ["#e74c3c","#3498db","#27ae60","#f39c12","#8e44ad","#16a085","#e67e22","#2c3e50"];

// approximate=true → dashed-border pin (city-level fallback)
function makePinIcon(color, size = 28, opacity = 1, approximate = false) {
  const inner = approximate
    ? `<circle cx="14" cy="12" r="5" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.8"/>`
    : `<circle cx="14" cy="12" r="5" fill="#fff" opacity="0.85"/>`;
  const pathFill = approximate ? "none" : color;
  const pathStroke = approximate ? color : "#fff";
  const pathStrokeWidth = approximate ? "2" : "1.5";
  const pathOpacity = approximate ? "0.7" : opacity;
  const html = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 1.35}" viewBox="0 0 28 38">
    <ellipse cx="14" cy="35" rx="5" ry="2.5" fill="rgba(0,0,0,0.18)"/>
    <path d="M14 2C8.48 2 4 6.48 4 12c0 7.5 10 24 10 24s10-16.5 10-24C24 6.48 19.52 2 14 2z"
      fill="${pathFill}" stroke="${pathStroke}" stroke-width="${pathStrokeWidth}" opacity="${pathOpacity}"/>
    ${inner}
  </svg>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size * 1.35],
    iconAnchor: [size / 2, size * 1.35],
    popupAnchor: [0, -(size * 1.35)],
  });
}

// Sub-component: flies map to bounds when filtered entries change
function MapBoundsUpdater({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (!positions.length) return;
    if (positions.length === 1) {
      map.setView(positions[0], 13, { animate: true });
    } else {
      map.fitBounds(positions.map(p => [p.lat, p.lng]), { padding: [40, 40], animate: true });
    }
  }, [positions, map]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function TripMapModal({ trip, onClose }) {
  const [dayFilter, setDayFilter] = useState("all");
  // coordsMap: entryId -> { lat, lng } | null
  const [coordsMap, setCoordsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const listRef = useRef(null);
  const markerRefs = useRef({});

  // Flatten all entries with day metadata
  const allEntries = useMemo(() => {
    if (!trip?.plan?.days) return [];
    return trip.plan.days.flatMap((day, di) =>
      (day.entries || day.items || []).map(e => ({
        ...e,
        _dayIdx: di,
        _dayLabel: day.name || `Day ${day.day || di + 1}`,
        _dayColor: DAY_COLORS[di % DAY_COLORS.length],
      }))
    );
  }, [trip]);

  // Geocode all entries on mount (sequential to respect Nominatim rate limit)
  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      const result = {};
      for (const e of allEntries) {
        if (cancelled) break;
        result[e.id] = await geocodeEntry(e);
        // Update map incrementally as each place resolves
        if (!cancelled) setCoordsMap(prev => ({ ...prev, [e.id]: result[e.id] }));
        // Nominatim fair-use: max 1 req/sec. We may do 2 fetches per entry (exact + city fallback)
        // so 600ms gap keeps us comfortably under the limit.
        await new Promise(r => setTimeout(r, 600));
      }
      if (!cancelled) setLoading(false);
    }
    run();
    return () => { cancelled = true; };
  }, [allEntries]);

  const filteredEntries = useMemo(() =>
    dayFilter === "all" ? allEntries : allEntries.filter(e => e._dayIdx === dayFilter),
    [allEntries, dayFilter]
  );

  const mappedEntries = useMemo(() =>
    filteredEntries.filter(e => coordsMap[e.id]),
    [filteredEntries, coordsMap]
  );

  const uniqueDays = useMemo(() => {
    const seen = new Set();
    return allEntries.reduce((acc, e) => {
      if (!seen.has(e._dayIdx)) { seen.add(e._dayIdx); acc.push({ idx: e._dayIdx, label: e._dayLabel, color: e._dayColor }); }
      return acc;
    }, []);
  }, [allEntries]);

  // Scroll the list to an entry when its pin is clicked
  const scrollToEntry = useCallback((id) => {
    setSelectedId(id);
    const el = listRef.current?.querySelector(`[data-entry-id="${id}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  // Fly to a marker when user clicks an entry row
  const flyToEntry = useCallback((entry) => {
    setSelectedId(entry.id);
    const coord = coordsMap[entry.id];
    if (!coord) return;
    const marker = markerRefs.current[entry.id];
    if (marker) {
      marker.openPopup();
    }
  }, [coordsMap]);

  const centerPos = mappedEntries.length
    ? [mappedEntries.reduce((s, e) => s + coordsMap[e.id].lat, 0) / mappedEntries.length,
       mappedEntries.reduce((s, e) => s + coordsMap[e.id].lng, 0) / mappedEntries.length]
    : [39.5, -98.35]; // continental US fallback

  const verdictOpacity = v => v === "skip" ? 0.45 : 1;

  return createPortal(
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1200,
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()}
        style={{ width: "min(96vw, 1100px)", height: "min(90vh, 720px)", background: "#fff",
          borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column",
          boxShadow: "0 24px 80px rgba(0,0,0,0.28)" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
          borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>🗺 {trip.destination} — Map View</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
              {loading
                ? `Locating ${allEntries.length} places…`
                : `${mappedEntries.length} of ${allEntries.length} places mapped`}
            </div>
          </div>
          {/* Day filter pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button onClick={() => setDayFilter("all")}
              style={{ borderRadius: 20, padding: "4px 12px", fontSize: 12, cursor: "pointer",
                border: "none", fontWeight: 600,
                background: dayFilter === "all" ? "#000" : "#f0f0f0",
                color: dayFilter === "all" ? "#fff" : "#555" }}>
              All Days
            </button>
            {uniqueDays.map(d => (
              <button key={d.idx} onClick={() => setDayFilter(d.idx)}
                style={{ borderRadius: 20, padding: "4px 12px", fontSize: 12, cursor: "pointer",
                  border: "none", fontWeight: 600,
                  background: dayFilter === d.idx ? d.color : "#f0f0f0",
                  color: dayFilter === d.idx ? "#fff" : "#555" }}>
                {d.label}
              </button>
            ))}
          </div>
          <button onClick={e => { e.stopPropagation(); onClose(); }}
            style={{ background: "none", border: "none", fontSize: 20, color: "#aaa", cursor: "pointer",
              lineHeight: 1, padding: "2px 4px", flexShrink: 0 }}>
            ✕
          </button>
        </div>

        {/* ── Body: map + list ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Map panel */}
          <div style={{ flex: "0 0 62%", position: "relative" }}>
            {loading && mappedEntries.length === 0 && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", background: "#f8f8f8", zIndex: 10, gap: 10 }}>
                <div style={{ fontSize: 28 }}>📍</div>
                <div style={{ fontSize: 13, color: "#888" }}>Geocoding locations…</div>
              </div>
            )}
            <MapContainer center={centerPos} zoom={mappedEntries.length ? 10 : 4}
              style={{ width: "100%", height: "100%" }}
              scrollWheelZoom={true}
              attributionControl={false}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© OpenStreetMap contributors'
              />
              {mappedEntries.length > 0 && (
                <MapBoundsUpdater positions={mappedEntries.map(e => coordsMap[e.id])} />
              )}
              {mappedEntries.map(e => {
                const coord = coordsMap[e.id];
                const isSelected = selectedId === e.id;
                const icon = makePinIcon(e._dayColor, isSelected ? 36 : 28, verdictOpacity(e.verdict), coord.approximate);
                return (
                  <Marker
                    key={e.id}
                    position={[coord.lat, coord.lng]}
                    icon={icon}
                    ref={r => { markerRefs.current[e.id] = r; }}
                    eventHandlers={{ click: () => scrollToEntry(e.id) }}>
                    <Popup>
                      <div style={{ minWidth: 140 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#000", marginBottom: 3 }}>{e.name}</div>
                        <div style={{ fontSize: 11, color: "#666" }}>{e.city}{e.state ? `, ${e.state}` : ""}</div>
                        {coord.approximate && (
                          <div style={{ fontSize: 10, color: "#f39c12", marginTop: 3 }}>~ Approximate location</div>
                        )}
                        {e.verdict && (
                          <div style={{ marginTop: 5, fontSize: 11, fontWeight: 600,
                            color: e.verdict === "must_go" ? "#27ae60" : e.verdict === "skip" ? "#e74c3c" : "#888" }}>
                            {e.verdict === "must_go" ? "✓ Must Go" : e.verdict === "skip" ? "✗ Skip" : ""}
                          </div>
                        )}
                        <div style={{ marginTop: 4, display: "inline-block", background: e._dayColor,
                          color: "#fff", borderRadius: 4, padding: "1px 7px", fontSize: 10, fontWeight: 600 }}>
                          {e._dayLabel}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* List panel */}
          <div ref={listRef} style={{ flex: 1, overflowY: "auto", borderLeft: "1px solid #f0f0f0", padding: "12px 0" }}>
            {filteredEntries.length === 0 && (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#aaa", fontSize: 13 }}>
                No places for this day
              </div>
            )}
            {uniqueDays
              .filter(d => dayFilter === "all" || dayFilter === d.idx)
              .map(day => {
                const dayEntries = filteredEntries.filter(e => e._dayIdx === day.idx);
                if (!dayEntries.length) return null;
                return (
                  <div key={day.idx}>
                    {/* Day section header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px 6px",
                      position: "sticky", top: 0, background: "#fff", zIndex: 2 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: day.color, flexShrink: 0 }} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#000" }}>{day.label}</div>
                    </div>
                    {dayEntries.map((e, i) => {
                      const hasCoord = !!coordsMap[e.id];
                      const isSelected = selectedId === e.id;
                      return (
                        <div key={e.id} data-entry-id={e.id}
                          onClick={() => hasCoord && flyToEntry(e)}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: 10,
                            padding: "9px 16px",
                            cursor: hasCoord ? "pointer" : "default",
                            background: isSelected ? "#fffbe6" : "transparent",
                            borderLeft: isSelected ? `3px solid ${day.color}` : "3px solid transparent",
                            transition: "background 0.15s",
                          }}>
                          <div style={{ width: 22, height: 22, borderRadius: "50%", background: day.color,
                            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1,
                            opacity: e.verdict === "skip" ? 0.4 : 1 }}>
                            {i + 1}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#000",
                              opacity: e.verdict === "skip" ? 0.5 : 1 }}>
                              {e.name}
                              {coordsMap[e.id]?.approximate && <span style={{ fontSize: 10, color: "#f39c12", marginLeft: 6 }}>~city area</span>}
                              {!hasCoord && loading && <span style={{ fontSize: 10, color: "#bbb", marginLeft: 6 }}>locating…</span>}
                              {!hasCoord && !loading && <span style={{ fontSize: 10, color: "#ccc", marginLeft: 6 }}>not mapped</span>}
                            </div>
                            <div style={{ fontSize: 11, color: "#999", marginTop: 1 }}>
                              {e.city}{e.state ? `, ${e.state}` : ""}{e.cuisine ? ` · ${e.cuisine}` : ""}
                            </div>
                            {e.verdict && (
                              <span style={{ fontSize: 10, fontWeight: 600, marginTop: 3, display: "inline-block",
                                color: e.verdict === "must_go" ? "#27ae60" : e.verdict === "skip" ? "#e74c3c" : "#888" }}>
                                {e.verdict === "must_go" ? "✓ Must Go" : e.verdict === "skip" ? "✗ Skip" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </div>
        </div>

        {/* ── Legend ── */}
        <div style={{ borderTop: "1px solid #f0f0f0", padding: "8px 18px", display: "flex",
          gap: 16, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Legend</span>
          <span style={{ fontSize: 11, color: "#555", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 13 }}>●</span> Pin color = Day
          </span>
          <span style={{ fontSize: 11, color: "#27ae60", fontWeight: 600 }}>✓ Must Go</span>
          <span style={{ fontSize: 11, color: "#e74c3c", fontWeight: 600 }}>✗ Skip (faded)</span>
          <span style={{ fontSize: 11, color: "#f39c12", fontWeight: 600 }}>○ ~city area (outline pin)</span>
          <span style={{ fontSize: 11, color: "#888" }}>Click pin → highlight row · Click row → open pin</span>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── MINI TRIP MAP (inline non-interactive preview) ──────────────────────────
function MiniTripMap({ trip, onOpenFull }) {
  const [coordsMap, setCoordsMap] = useState({});
  const [done, setDone] = useState(false);

  const allEntries = useMemo(() => {
    if (!trip?.plan?.days) return [];
    return trip.plan.days.flatMap((day, di) =>
      (day.entries || day.items || []).map(e => ({
        ...e, _dayIdx: di, _dayColor: DAY_COLORS[di % DAY_COLORS.length],
      }))
    );
  }, [trip]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      for (const e of allEntries) {
        if (cancelled) break;
        const coord = await geocodeEntry(e);
        if (!cancelled && coord) setCoordsMap(prev => ({ ...prev, [e.id]: coord }));
        await new Promise(r => setTimeout(r, 600));
      }
      if (!cancelled) setDone(true);
    }
    run();
    return () => { cancelled = true; };
  }, [allEntries]);

  const mapped = allEntries.filter(e => coordsMap[e.id]);

  if (mapped.length === 0) {
    return (
      <div onClick={onOpenFull} style={{ height: 140, background: "#f8f8f8", display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
        cursor: "pointer", gap: 6, borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ fontSize: 26 }}>🗺</div>
        <div style={{ fontSize: 12, color: "#bbb" }}>{done ? "No locations found" : "Locating places…"}</div>
        {done && <div style={{ fontSize: 11, color: "#ccc" }}>Tap to open map</div>}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: 150, borderBottom: "1px solid #f0f0f0" }}>
      {/* Non-interactive map rendered under pointer-events:none wrapper */}
      <div style={{ pointerEvents: "none", height: 150 }}>
        <MapContainer center={[mapped[0] ? coordsMap[mapped[0].id].lat : 39.5, mapped[0] ? coordsMap[mapped[0].id].lng : -98.35]}
          zoom={10} style={{ width: "100%", height: "100%" }}
          dragging={false} scrollWheelZoom={false} zoomControl={false}
          attributionControl={false} doubleClickZoom={false} touchZoom={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapBoundsUpdater positions={mapped.map(e => coordsMap[e.id])} />
          {mapped.map(e => (
            <Marker key={e.id} position={[coordsMap[e.id].lat, coordsMap[e.id].lng]}
              icon={makePinIcon(e._dayColor, 22, 1, coordsMap[e.id].approximate)} />
          ))}
        </MapContainer>
      </div>
      {/* Transparent click overlay */}
      <div onClick={onOpenFull} style={{ position: "absolute", inset: 0, cursor: "pointer", zIndex: 1000 }}>
        <div style={{ position: "absolute", bottom: 10, right: 10 }}>
          <div style={{ background: "rgba(255,255,255,0.92)", borderRadius: 8, padding: "5px 11px",
            fontSize: 11, fontWeight: 600, color: "#333", boxShadow: "0 2px 8px rgba(0,0,0,0.13)",
            backdropFilter: "blur(4px)" }}>
            View Full Map →
          </div>
        </div>
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 8, padding: "3px 9px",
            fontSize: 11, color: "#666", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
            {mapped.length} of {allEntries.length} places mapped
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED TRIP CARD ────────────────────────────────────────────────────────
function SharedTripCard({ trip, sharer, onImportToLogs, onViewProfile, savedTrips, onAddToTrip }) {
  const [expanded, setExpanded] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const allEntries = (trip.plan?.days || []).flatMap(d => d.entries || d.items || []);
  const previewNames = allEntries.slice(0, 3).map(e => e.name);

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 20,
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)", transition: "box-shadow 0.2s, transform 0.2s",
      overflow: "hidden" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "none"; }}>

      {/* ── HEADER ── */}
      <div onClick={() => setExpanded(!expanded)} style={{ padding: "20px 20px 16px", cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: "#111", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
              {trip.destination}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#999" }}>{trip.days} day{trip.days !== 1 ? "s" : ""}</span>
              <span style={{ color: "#ddd" }}>·</span>
              <span style={{ fontSize: 12, color: "#999" }}>
                Shared by{" "}
                <span
                  onClick={e => { e.stopPropagation(); sharer && onViewProfile && onViewProfile(sharer.id); }}
                  style={{ cursor: sharer && onViewProfile ? "pointer" : "default", textDecoration: sharer && onViewProfile ? "underline" : "none", color: "#555", fontWeight: 600 }}>
                  {sharer?.avatar} {sharer?.name || "a friend"}
                </span>
              </span>
              <span style={{ color: "#ddd" }}>·</span>
              <span style={{ fontSize: 12, color: "#bbb" }}>{trip.sharedAt}</span>
              <span style={{ fontSize: 10, background: "#f0f7ff", color: "#60a5fa", borderRadius: 20,
                padding: "2px 8px", fontWeight: 600, letterSpacing: "0.04em" }}>SHARED</span>
            </div>
            {/* Place name preview when collapsed */}
            {!expanded && previewNames.length > 0 && (
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 10 }}>
                {previewNames.map((name, i) => (
                  <span key={name + '-' + i} style={{ background: "#f5f3ef", border: "1px solid #e8e4dc",
                    borderRadius: 20, padding: "3px 11px", fontSize: 11, color: "#666" }}>
                    {name}
                  </span>
                ))}
                {allEntries.length > 3 && (
                  <span style={{ background: "#f5f3ef", border: "1px solid #e8e4dc",
                    borderRadius: 20, padding: "3px 11px", fontSize: 11, color: "#aaa" }}>
                    +{allEntries.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
          <div style={{ width: 28, height: 28, display: "flex", alignItems: "center",
            justifyContent: "center", color: "#ccc", fontSize: 12,
            transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</div>
        </div>
      </div>

      {/* ── EXPANDED BODY ── */}
      {expanded && trip.plan && (
        <div style={{ borderTop: "1px solid #f0f0f0" }}>

          {/* Mini map */}
          {allEntries.length > 0 && (
            <MiniTripMap trip={trip} onOpenFull={() => setShowMapModal(true)} />
          )}

          {/* Timeline */}
          <div style={{ padding: "20px 20px 24px" }}>
            {trip.plan.days.map((day, dayIdx) => {
              const dayColor = DAY_COLORS[dayIdx % DAY_COLORS.length];
              const dayEntries = day.entries || day.items || [];
              const isLast = dayIdx === trip.plan.days.length - 1;
              const dayDate = trip.startDate ? (() => {
                const d = new Date(trip.startDate + "T12:00:00");
                d.setDate(d.getDate() + dayIdx);
                return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
              })() : null;

              return (
                <div key={dayIdx} style={{ display: "flex", gap: 0, marginBottom: isLast ? 0 : 28 }}>
                  {/* Timeline spine */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
                    marginRight: 16, flexShrink: 0, width: 28 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: dayColor,
                      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800, flexShrink: 0,
                      boxShadow: `0 0 0 3px ${dayColor}22` }}>
                      {dayIdx + 1}
                    </div>
                    {!isLast && (
                      <div style={{ width: 2, flex: 1, background: `${dayColor}30`,
                        marginTop: 6, minHeight: 20, borderRadius: 1 }} />
                    )}
                  </div>

                  {/* Day content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Day header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                      marginBottom: 10, gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#111", lineHeight: 1.3 }}>
                          {day.name || ("Day " + (dayIdx + 1) + (day.city ? " — " + day.city : ""))}
                        </div>
                        {dayDate && <div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>{dayDate}</div>}
                      </div>
                      <DayMapButton day={day} />
                    </div>

                    {day.activity && (
                      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8, fontStyle: "italic" }}>
                        {day.activity}
                      </div>
                    )}

                    {/* Place cards */}
                    {dayEntries.map((e, entIdx) => (
                      <div key={e.id}>
                        {entIdx > 0 && (e.distanceFromPrev || e.travelTimeFromPrev) && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 6px 18px" }}>
                            <div style={{ width: 1, height: 14, background: "#e0e0e0" }} />
                            <span style={{ fontSize: 10, color: "#bbb", fontWeight: 500 }}>
                              {[e.distanceFromPrev, e.travelTimeFromPrev].filter(Boolean).join(" · ")}
                            </span>
                          </div>
                        )}
                      <div onClick={ev => ev.stopPropagation()}
                        style={{ display: "flex", gap: 12, alignItems: "flex-start",
                          padding: "11px 13px", marginBottom: 6,
                          background: "#fff", border: "1px solid #efefef", borderRadius: 14,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>

                        {/* Type icon thumbnail */}
                        <div style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                          background: dayColor + "18", display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: 20 }}>
                          {{ restaurant: "🍽", hotel: "🏨", brewery: "🍺", cafe: "☕", activity: "🏔", hiking: "🥾" }[e.type] || "📍"}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#111", lineHeight: 1.3 }}>
                            {e.name}
                          </div>
                          <div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>
                            {[e.cuisine || e.type, e.city].filter(Boolean).join(" · ")}
                          </div>
                          {e.verdict && (
                            <div style={{ marginTop: 5 }}>
                              <VerdictBadge verdict={e.verdict} />
                            </div>
                          )}
                          {e.notes && (
                            <div style={{ fontSize: 11, color: "#ccc", marginTop: 4, fontStyle: "italic" }}>
                              {e.notes}
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 5, flexShrink: 0 }}>
                          <button onClick={ev => { ev.stopPropagation(); onImportToLogs(e); }}
                            title="Log to diary"
                            style={{ height: 28, borderRadius: 8, cursor: "pointer",
                              border: "1.5px solid #c8a882", background: "#fdf6f0", flexShrink: 0,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, fontWeight: 700, color: "#b07040", padding: "0 10px",
                              letterSpacing: "0.03em" }}>
                            Log
                          </button>
                          {savedTrips && savedTrips.filter(t => !t.completed).length > 0 && (
                            <select onClick={ev => ev.stopPropagation()}
                              onChange={ev => { if (ev.target.value && onAddToTrip) { onAddToTrip(ev.target.value, e); ev.target.value = ""; }}}
                              style={{ height: 28, background: "#000", color: "#fff", border: "none", borderRadius: 8,
                                padding: "0 6px", fontSize: 10, fontWeight: 600, cursor: "pointer", width: "100%" }}
                              defaultValue="">
                              <option value="" disabled>+ Trip</option>
                              {savedTrips.filter(t => !t.completed).map(t => (
                                <option key={t.id} value={t.id}>{t.destination}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full map modal */}
      {showMapModal && (
        <TripMapModal trip={trip} onClose={() => setShowMapModal(false)} />
      )}
    </div>
  );
}

// ─── ADD PLACE INPUT WITH SUGGESTIONS ───────────────────────────────────────
// Maps Google Places types to our internal types
function inferTypeFromGoogleTypes(types) {
  if (!types) return "activity";
  if (types.some(t => ["restaurant","food","meal_takeaway","meal_delivery","cafe","bakery","bar"].includes(t))) {
    if (types.includes("bar") || types.includes("night_club")) return "brewery";
    if (types.includes("cafe") || types.includes("bakery")) return "cafe";
    return "restaurant";
  }
  if (types.some(t => ["lodging","hotel"].includes(t))) return "activity";
  if (types.some(t => ["park","natural_feature","campground"].includes(t))) return "hiking";
  return "activity";
}

async function searchGooglePlaces(query, destination) {
  try {
    const url = `/api/places?q=${encodeURIComponent(query)}&destination=${encodeURIComponent(destination)}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.error || data.status === "REQUEST_DENIED") return [];
    return (data.results || []).slice(0, 6).map(p => {
      const addr = p.formatted_address || "";
      const parts = addr.split(",").map(s => s.trim());
      return {
        id: "gp_" + p.place_id,
        name: p.name,
        type: inferTypeFromGoogleTypes(p.types),
        city: parts[1] || parts[0] || "",
        state: parts[2]?.replace(/\d+/g, "").trim() || "",
        country: parts[parts.length - 1] || "",
        verdict: "want_to_try",
        cuisine: "",
        notes: p.formatted_address || "",
        rating: p.rating || null,
        _source: "google",
      };
    });
  } catch {
    return [];
  }
}

function AddPlaceInput({ entries, trip, onAdd }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);
  const [googleResults, setGoogleResults] = useState([]);
  const [googleLoading, setGoogleLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const destParts = (trip.destination || "").split(",").map(s => s.trim());
  const destState = destParts[1] || "";
  const destCountry = destParts[2] || destParts[1] || "";

  // Local entries filtered to same region
  const localSuggestions = query.trim().length >= 1
    ? (entries || []).filter(e => {
        const q = query.toLowerCase();
        const matchesQuery = e.name.toLowerCase().includes(q) ||
          (e.city || "").toLowerCase().includes(q) ||
          (e.cuisine || "").toLowerCase().includes(q);
        const sameRegion = destState
          ? (e.state || "").toLowerCase() === destState.toLowerCase()
          : destCountry
            ? (e.country || "").toLowerCase().includes(destCountry.toLowerCase())
            : true;
        return matchesQuery && sameRegion;
      }).slice(0, 4)
    : [];

  // Trigger Google Places search with debounce
  useEffect(() => {
    if (query.trim().length < 2) { setGoogleResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setGoogleLoading(true);
      const results = await searchGooglePlaces(query, trip.destination || "");
      setGoogleResults(results);
      setGoogleLoading(false);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query, trip.destination]);

  const commit = (entry) => {
    if (typeof entry === "string") {
      if (!entry.trim()) return;
      onAdd({ name: entry.trim() });
    } else {
      onAdd(entry);
    }
    setQuery("");
    setOpen(false);
    setGoogleResults([]);
  };

  const handleFocus = () => {
    if (inputRef.current) setRect(inputRef.current.getBoundingClientRect());
    setOpen(true);
  };

  const hasResults = localSuggestions.length > 0 || googleResults.length > 0 || googleLoading || query.trim();

  const PlaceRow = ({ e, badge }) => (
    <div onMouseDown={() => commit(e)}
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
        cursor: "pointer", borderBottom: "1px solid #f5f5f5" }}
      onMouseEnter={ev => ev.currentTarget.style.background = "#f8f8f8"}
      onMouseLeave={ev => ev.currentTarget.style.background = "#fff"}>
      <span style={{ fontSize: 16 }}>
        {{ restaurant: "🍽", hotel: "🏨", brewery: "🍺", cafe: "☕", activity: "🏔", hiking: "🥾" }[e.type] || "📍"}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</div>
        <div style={{ fontSize: 11, color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {e._source === "google"
            ? e.notes
            : [e.cuisine || e.type, e.city, e.state].filter(Boolean).join(" · ")}
        </div>
      </div>
      {badge && <span style={{ fontSize: 9, fontWeight: 700, color: badge.color, background: badge.bg, border: `1px solid ${badge.border}`, borderRadius: 6, padding: "2px 6px", flexShrink: 0 }}>{badge.label}</span>}
    </div>
  );

  return (
    <div style={{ position: "relative", marginTop: 2 }} onClick={e => e.stopPropagation()}>
      <input
        ref={inputRef}
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); if (inputRef.current) setRect(inputRef.current.getBoundingClientRect()); }}
        onFocus={e => { handleFocus(); e.target.style.borderColor = "#ccc"; }}
        onBlur={e => { setTimeout(() => setOpen(false), 150); e.target.style.borderColor = "#e8e8e8"; }}
        onKeyDown={ev => { if (ev.key === "Enter") { commit(query); ev.target.blur(); } if (ev.key === "Escape") { setOpen(false); setQuery(""); } }}
        placeholder="+ Add a place…"
        style={{ width: "100%", boxSizing: "border-box", background: "transparent",
          border: "1.5px dashed #e8e8e8", borderRadius: 12, padding: "9px 13px",
          fontSize: 12, color: "#555", outline: "none", cursor: "text" }}
      />
      {open && rect && hasResults && createPortal(
        <div style={{
          position: "fixed", top: rect.bottom + 4, left: rect.left, width: rect.width,
          background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 9999, overflow: "hidden", maxHeight: 340, overflowY: "auto"
        }}>
          {/* Local network results */}
          {localSuggestions.length > 0 && (
            <>
              <div style={{ padding: "6px 14px 4px", fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em" }}>From your network</div>
              {localSuggestions.map(e => (
                <PlaceRow key={e.id} e={e} badge={e.verdict === "must_go" ? { label: "MUST GO", color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0" } : null} />
              ))}
            </>
          )}

          {/* Google Places results */}
          {(googleLoading || googleResults.length > 0) && (
            <>
              <div style={{ padding: "6px 14px 4px", fontSize: 10, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: "0.06em", borderTop: localSuggestions.length > 0 ? "1px solid #f0f0f0" : "none" }}>
                {googleLoading ? "Searching Google Places…" : "Google Places"}
              </div>
              {googleResults.map(e => (
                <PlaceRow key={e.id} e={e} badge={{ label: "Google", color: "#4285f4", bg: "#f0f6ff", border: "#c7d9ff" }} />
              ))}
            </>
          )}

          {/* Fallback: add as free text */}
          {query.trim() && (
            <div onMouseDown={() => commit(query)}
              style={{ padding: "9px 14px", cursor: "pointer", fontSize: 12, color: "#888", fontStyle: "italic", borderTop: "1px solid #f0f0f0" }}
              onMouseEnter={ev => ev.currentTarget.style.background = "#f8f8f8"}
              onMouseLeave={ev => ev.currentTarget.style.background = "#fff"}>
              Add "{query}" as new place
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

function MoveDaySelect({ days, currentDayIdx, onMove }) {
  const [val, setVal] = useState("");
  return (
    <select
      value={val}
      title="Move to day"
      onChange={ev => { setVal(""); onMove(Number(ev.target.value)); }}
      style={{ width: 32, height: 32, borderRadius: 8, cursor: "pointer",
        border: "1.5px solid #e0e0e0", background: "transparent",
        fontSize: 13, color: "#888", padding: 0, appearance: "none",
        WebkitAppearance: "none", textAlign: "center", outline: "none" }}>
      <option value="" disabled>⇄</option>
      {days.map((d, i) => i !== currentDayIdx && (
        <option key={i} value={i}>Day {i + 1}{d.name ? `: ${d.name}` : ""}</option>
      ))}
    </select>
  );
}

// ─── TRIP CARD COMPONENT ─────────────────────────────────────────────────────
function TripCard({ trip, entries, onDelete, onComplete, onReactivate, past, friendState, allUsers, onInviteFriend, onAddPlaces, onImportToLogs, onImportSingle, onUpdate, onEdit, onShare, focusSection, onFocusHandled, onViewProfile }) {
  const cardRef = useRef(null);
  const [expanded, setExpanded] = useState(!!focusSection);
  const [editing, setEditing] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [regenNotes, setRegenNotes] = useState(trip.notes || "");
  // eslint-disable-next-line no-unused-vars
  const [regenLoading, setRegenLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [regenError, setRegenError] = useState("");
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [confirmingComplete, setConfirmingComplete] = useState(false);
  const [completePhotoStep, setCompletePhotoStep] = useState(false); // after confirm → photo prompt
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [showInviteDropdown, setShowInviteDropdown] = useState(false);
  const [inviteSearch, setInviteSearch] = useState("");
  const [shareSearch, setShareSearch] = useState("");
  const [newReminderText, setNewReminderText] = useState("");
  const [newPackItem, setNewPackItem] = useState("");
  const [showPackList, setShowPackList] = useState(focusSection === "packList");
  const [showBookRemind, setShowBookRemind] = useState(focusSection === "bookRemind");
  const [showIdeasNote, setShowIdeasNote] = useState(focusSection === "ideasNote");
  const [newIdeaText, setNewIdeaText] = useState("");
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [collapsedDays, setCollapsedDays] = useState(new Set());
  const toggleDayCollapse = idx => setCollapsedDays(prev => {
    const s = new Set(prev); s.has(idx) ? s.delete(idx) : s.add(idx); return s;
  });
  const allDaysCount = trip.plan?.days?.length || 0;
  const allCollapsed = collapsedDays.size === allDaysCount && allDaysCount > 0;
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const [overflowMenuPos, setOverflowMenuPos] = useState(null);
  const overflowBtnRef = useRef(null);
  const utilitySectionRef = useRef(null);

  useEffect(() => {
    if (!expanded) setConfirmingComplete(false);
  }, [expanded]);

  useEffect(() => {
    if (!showBookRemind && !showPackList && !showIdeasNote) return;
    const handleClickOutside = e => {
      if (utilitySectionRef.current && !utilitySectionRef.current.contains(e.target)) {
        setShowBookRemind(false);
        setShowPackList(false);
        setShowIdeasNote(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBookRemind, showPackList, showIdeasNote]);

  useEffect(() => {
    if (!expanded) return;
    const handleClickOutside = e => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

  useEffect(() => {
    if (!focusSection) return;
    const timer = setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      onFocusHandled && onFocusHandled();
    }, 100);
    return () => clearTimeout(timer);
  }, [focusSection, onFocusHandled]);

  useEffect(() => {
    if (!showShareDropdown) return;
    const close = () => { setShowShareDropdown(false); setShareSearch(""); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showShareDropdown]);

  useEffect(() => {
    if (!showInviteDropdown) return;
    const close = () => { setShowInviteDropdown(false); setInviteSearch(""); };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showInviteDropdown]);

  useEffect(() => {
    if (!showOverflowMenu) return;
    const close = () => setShowOverflowMenu(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [showOverflowMenu]);

  const openOverflowMenu = (e) => {
    e.stopPropagation();
    const rect = overflowBtnRef.current?.getBoundingClientRect();
    if (rect) setOverflowMenuPos({ top: rect.bottom + window.scrollY + 6, right: window.innerWidth - rect.right });
    setShowOverflowMenu(v => !v);
  };

  const toggleVisited = (dayIdx, entryId) => {
    if (!onUpdate) return;
    const newDays = trip.plan.days.map((d, i) =>
      i === dayIdx
        ? { ...d, entries: (d.entries || d.items || []).map(e => e.id === entryId ? { ...e, visited: !e.visited } : e) }
        : d
    );
    onUpdate({ ...trip, plan: { ...trip.plan, days: newDays } });
  };

  // eslint-disable-next-line no-unused-vars
  const regenerateFromNotes = async () => {
    if (!regenNotes.trim()) return;
    setRegenLoading(true);
    setRegenError("");
    try {
      const n = trip.plan.days.length;
      const dest = trip.destination || "the destination";
      const distUnit = usesImperial(dest) ? "miles" : "km";
      const distLabel = distUnit === "miles" ? "mi" : "km";
      const existingPlaces = trip.plan.days
        .flatMap(d => (d.entries || []).map(e => `${e.name}${e.city ? " (" + e.city + ")" : ""}`))
        .join(", ");
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 3500,
          messages: [{
            role: "user",
            content: `You are an expert travel itinerary planner. Rebuild this ${n}-day trip to ${dest} using the updated notes below.

Instructions:
1. Extract every place, restaurant, bar, attraction, or activity mentioned in the notes.
2. Group places by neighborhood or geographic area — places within walking distance or a short drive go on the same day.
3. Name each day after its area: "Day 1 — Downtown & LoDo", "Day 2 — RiNo & Five Points", etc.
4. Order days logically as a loop: start near arrival, explore outward, end near departure.
5. 3–5 places per day, ordered by time of day: breakfast → lunch → afternoon → dinner → bar/evening.
6. For each place infer type (restaurant/cafe/brewery/bar/activity/hiking), cuisine if food, city if mentioned.
7. "Must go" / "highly recommend" → verdict "must_go". Otherwise "want_to_try".
8. If user specifies a day for a place ("Day 2: Red Rocks"), honor it.
9. Default city to ${dest} if not mentioned. Do not invent places.${existingPlaces ? `\nCurrently in the trip: ${existingPlaces}` : ""}
10. For every place EXCEPT the first in each day, estimate the travel distance from the previous stop using ${distUnit} (e.g. "0.8 ${distLabel}") and approximate travel mode + time (e.g. "10 min walk" or "5 min drive"). Set distanceFromPrev and travelTimeFromPrev. Leave both null for the first place of each day.

Updated notes:
<user_notes>${regenNotes}</user_notes>

Return ONLY valid JSON, no explanation, no markdown fences:
{"days":[{"id":"s1","name":"Day 1 — Neighborhood","entries":[{"id":"i1_1","name":"Place Name","type":"restaurant","notes":"tip","city":"City","state":"CO","verdict":"must_go","cuisine":"Italian","distanceFromPrev":null,"travelTimeFromPrev":null}]}]}`
          }]
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.[0]?.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("AI response didn't contain valid JSON.");
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.days && parsed.days.length > 0) {
        const newDays = parsed.days.map((d, i) => ({
          ...d,
          day: i + 1,
          name: d.name,
          entries: (d.entries || d.items || []).map((e, j) => ({
            id: e.id || ("r_" + i + "_" + j),
            name: e.name, type: e.type || "activity",
            city: e.city || dest, state: e.state || "",
            verdict: e.verdict || "must_go",
            cuisine: e.cuisine || "", notes: e.notes || e.note || "",
            distanceFromPrev: e.distanceFromPrev || null,
            travelTimeFromPrev: e.travelTimeFromPrev || null
          }))
        }));
        onUpdate({ ...trip, notes: regenNotes, plan: { ...trip.plan, days: newDays } });
        setRegenError("");
      } else {
        throw new Error("AI returned an empty plan.");
      }
    } catch(err) {
      setRegenError("Could not regenerate: " + (err.message || "Unknown error"));
    }
    setRegenLoading(false);
  };

  const removePlace = (dayIdx, entryId) => {
    if (!onUpdate) return;
    const newDays = trip.plan.days.map((d, i) =>
      i === dayIdx ? { ...d, entries: (d.entries || d.items || []).filter(e => e.id !== entryId) } : d
    );
    onUpdate({ ...trip, plan: { ...trip.plan, days: newDays } });
  };

  const movePlace = (fromDayIdx, entryId, toDayIdx) => {
    if (!onUpdate) return;
    const fromDay = trip.plan.days[fromDayIdx];
    const entry = (fromDay.entries || fromDay.items || []).find(e => e.id === entryId);
    if (!entry) return;
    const newDays = trip.plan.days.map((d, i) => {
      if (i === fromDayIdx) return { ...d, entries: (d.entries || d.items || []).filter(e => e.id !== entryId) };
      if (i === toDayIdx) return { ...d, entries: [...(d.entries || d.items || []), entry] };
      return d;
    });
    onUpdate({ ...trip, plan: { ...trip.plan, days: newDays } });
  };

  const updateDayName = (dayIdx, name) => {
    if (!onUpdate) return;
    const newDays = trip.plan.days.map((d, i) => i === dayIdx ? { ...d, name } : d);
    onUpdate({ ...trip, plan: { ...trip.plan, days: newDays } });
  };

  const updateDayNotes = (dayIdx, notes) => {
    if (!onUpdate) return;
    const newDays = trip.plan.days.map((d, i) => i === dayIdx ? { ...d, notes } : d);
    onUpdate({ ...trip, plan: { ...trip.plan, days: newDays } });
  };

  // eslint-disable-next-line no-unused-vars
  const addPlace = (dayIdx, name) => {
    if (!onUpdate || !name.trim()) return;
    const newEntry = { id: "q_" + Date.now(), name: name.trim(), type: "activity", city: trip.destination, state: "", verdict: "must_go", cuisine: "" };
    const newDays = trip.plan.days.map((d, i) =>
      i === dayIdx ? { ...d, entries: [...(d.entries || d.items || []), newEntry] } : d
    );
    onUpdate({ ...trip, plan: { ...trip.plan, days: newDays } });
  };



  // Progress counts
  const allPlanEntries = trip.plan ? trip.plan.days.flatMap(d => d.entries || d.items || []) : [];
  const totalPlaces = allPlanEntries.length;
  const visitedCount = allPlanEntries.filter(e => e.visited).length;

  // Date range string
  const dateStr = trip.startDate
    ? new Date(trip.startDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      (trip.endDate ? " – " + new Date(trip.endDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "")
    : trip.createdAt;

  // Overflow menu item helper
  const OMenuItem = ({ icon, label, onClick, danger }) => (
    <div onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", cursor: "pointer",
        color: danger ? "#ef4444" : "#222", fontSize: 13, transition: "background 0.1s" }}
      onMouseEnter={e => e.currentTarget.style.background = "#f7f7f7"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{icon}</span>
      {label}
    </div>
  );

  const destSlug = (trip.destination || "travel").toLowerCase().replace(/[^a-z0-9]/g, '');
  const heroImg = `https://picsum.photos/seed/${destSlug}/800/300`;

  return (
    <div ref={cardRef} style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 20,
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)", transition: "box-shadow 0.2s, transform 0.2s",
      overflow: "hidden" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.13)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "none"; }}>

      {/* ── ACTIVE TRIP: Hero image header ── */}
      {!past && (
        <>
          <div style={{ position: "relative", height: 180, overflow: "hidden", cursor: "pointer" }}
            onClick={() => setExpanded(!expanded)}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${heroImg})`,
              backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.65) 100%)" }} />
            {/* Top-right: Live badge + overflow + chevron */}
            <div style={{ position: "absolute", top: 13, right: 14, display: "flex", gap: 7, alignItems: "center" }}>
              <span style={{ background: "rgba(34,197,94,0.88)", backdropFilter: "blur(4px)",
                color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "4px 10px",
                display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
                Live
              </span>
              <button ref={overflowBtnRef} onClick={openOverflowMenu}
                style={{ width: 30, height: 30, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)",
                  border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, cursor: "pointer",
                  color: "#fff", fontSize: 15, letterSpacing: "2px", lineHeight: 1, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                ···
              </button>
              <div style={{ width: 26, height: 26, display: "flex", alignItems: "center",
                justifyContent: "center", color: "rgba(255,255,255,0.85)", fontSize: 14,
                transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</div>
            </div>
            {/* Bottom: destination + meta */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 18px" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px",
                lineHeight: 1.2, textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
                {trip.destination}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.88)" }}>
                  📅 {trip.days} day{trip.days !== 1 ? "s" : ""}
                </span>
                <span style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.88)" }}>
                  {trip.kids ? "👨‍👩‍👧 Family" : "🧑 Adults"}
                </span>
                {trip.startDate && <>
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.88)" }}>{dateStr}</span>
                </>}
              </div>
              {!expanded && totalPlaces > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <div style={{ flex: 1, maxWidth: 120, height: 3, background: "rgba(255,255,255,0.25)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(visitedCount / totalPlaces) * 100}%`,
                      background: visitedCount === totalPlaces ? "#4ade80" : "#fff", borderRadius: 2, transition: "width 0.4s" }} />
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{visitedCount}/{totalPlaces}</span>
                </div>
              )}
            </div>
          </div>
          {/* Collaborators strip — clickable profile links */}
          {(trip.invitedFriends || []).length > 0 && (
            <div style={{ padding: "10px 18px", borderBottom: "1px solid #f0f0f0",
              background: "#fafaf8" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#aaa", letterSpacing: "0.05em",
                textTransform: "uppercase", marginBottom: 7 }}>
                Collaborators
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(trip.invitedFriends || []).map(uid => {
                  const u = allUsers?.find(x => x.id === uid);
                  return u ? (
                    <button key={uid}
                      onClick={e => { e.stopPropagation(); onViewProfile && onViewProfile(uid); }}
                      title={`View ${u.name}'s profile`}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6,
                        background: "#fff", border: "1px solid #e8e4dc", borderRadius: 20,
                        padding: "4px 10px 4px 6px", cursor: "pointer",
                        transition: "background 0.15s, border-color 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#f5f3ef"; e.currentTarget.style.borderColor = "#c8c4bc"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#e8e4dc"; }}>
                      <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#e8f0fe",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                        flexShrink: 0 }}>
                        {u.avatar}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: "#333" }}>
                        {u.name.split(" ")[0]}
                      </span>
                      <span style={{ fontSize: 11, color: "#aaa" }}>@{u.username}</span>
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          )}
          {/* Suggestions from collaborators */}
          {(trip.collaboratorSuggestions || []).length > 0 && (
            <div style={{ padding: "10px 18px", borderBottom: "1px solid #f0f0f0", background: "#fffdf8" }}>
              <div style={{ fontSize: 11, color: "#888", fontWeight: 600, marginBottom: 8 }}>
                💡 Suggestions from your group
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(trip.collaboratorSuggestions || []).map(s => {
                  const suggester = allUsers?.find(x => x.id === s.userId);
                  return (
                    <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8,
                      background: "#fff", border: "1px solid #efefef", borderRadius: 10,
                      padding: "8px 12px" }}>
                      <span style={{ fontSize: 15 }}>{suggester?.avatar || "👤"}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#000" }}>{s.name}</div>
                        <div style={{ fontSize: 10, color: "#888" }}>{suggester?.name?.split(" ")[0]} · Day {s.dayIdx + 1}</div>
                      </div>
                      <button onClick={() => {
                        const updated = { ...trip };
                        const days = [...(updated.plan?.days || [])];
                        if (days[s.dayIdx]) {
                          days[s.dayIdx] = { ...days[s.dayIdx], entries: [...(days[s.dayIdx].entries || []),
                            { id: "sg_" + Date.now(), name: s.name, type: s.type || "restaurant", city: s.city, state: s.state, verdict: "must_go" }] };
                        }
                        updated.plan = { ...updated.plan, days };
                        updated.collaboratorSuggestions = (trip.collaboratorSuggestions || []).filter(x => x.id !== s.id);
                        onUpdate && onUpdate(updated);
                      }} style={{ background: "#22c55e", border: "none", borderRadius: 8, padding: "4px 10px",
                        fontSize: 11, color: "#fff", cursor: "pointer", fontWeight: 600 }}>
                        Add ✓
                      </button>
                      <button onClick={() => onUpdate && onUpdate({ ...trip,
                        collaboratorSuggestions: (trip.collaboratorSuggestions || []).filter(x => x.id !== s.id) })}
                        style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 16 }}>
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── PAST TRIP: Thumbnail + text layout ── */}
      {past && (
        <div onClick={() => setExpanded(!expanded)} style={{ display: "flex", cursor: "pointer" }}>
          <div style={{ width: 88, flexShrink: 0, minHeight: 100,
            backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div style={{ flex: 1, padding: "14px 14px", minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#111", letterSpacing: "-0.2px", lineHeight: 1.2 }}>
                  {trip.destination}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "#999" }}>{trip.days} day{trip.days !== 1 ? "s" : ""}</span>
                  <span style={{ color: "#ddd" }}>·</span>
                  <span style={{ fontSize: 11, color: "#999" }}>{trip.kids ? "Family" : "Adults"}</span>
                  <span style={{ color: "#ddd" }}>·</span>
                  <span style={{ fontSize: 11, color: "#999" }}>{dateStr}</span>
                  <span style={{ fontSize: 10, background: "#f4f4f4", color: "#aaa", borderRadius: 20,
                    padding: "2px 8px", fontWeight: 600, letterSpacing: "0.04em" }}>PAST</span>
                </div>
                {totalPlaces > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                    <div style={{ flex: 1, maxWidth: 100, height: 4, background: "#f0f0f0", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(visitedCount / totalPlaces) * 100}%`,
                        background: "#4ade80", borderRadius: 2, transition: "width 0.4s" }} />
                    </div>
                    <span style={{ fontSize: 11, color: "#bbb" }}>{visitedCount}/{totalPlaces}</span>
                  </div>
                )}
                {(trip.sharedWith || []).length > 0 && (
                  <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                    {trip.sharedWith.slice(0, 3).map(uid => {
                      const u = (allUsers || []).find(x => x.id === uid);
                      return u ? (
                        <span key={uid} style={{ background: "#f7f7f7", border: "1px solid #efefef",
                          borderRadius: 20, padding: "2px 8px", fontSize: 10, color: "#666" }}>
                          {u.avatar} {u.name.split(" ")[0]}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
                <button ref={overflowBtnRef} onClick={openOverflowMenu}
                  style={{ width: 30, height: 30, background: showOverflowMenu ? "#f2f2f2" : "transparent",
                    border: "1px solid #e8e8e8", borderRadius: 8, cursor: "pointer", fontSize: 14,
                    color: "#777", display: "flex", alignItems: "center", justifyContent: "center",
                    letterSpacing: "2px", lineHeight: 1, fontWeight: 700 }}>
                  ···
                </button>
                <div style={{ width: 26, height: 26, display: "flex", alignItems: "center",
                  justifyContent: "center", color: "#ccc", fontSize: 12,
                  transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── INVITE PANEL (inline, triggered from ⋯) ── */}
      {showInviteDropdown && (
        <div onClick={e => e.stopPropagation()}
          style={{ margin: "0 20px 16px", background: "#fafafa", border: "1px solid #efefef",
            borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 10, letterSpacing: "0.04em" }}>
            👥 INVITE FRIENDS
          </div>
          {(trip.invitedFriends || []).length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
              {(trip.invitedFriends || []).map(uid => {
                const u = (allUsers || []).find(x => x.id === uid);
                return u ? (
                  <span key={uid} onClick={() => onInviteFriend(uid)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#111",
                      color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 12, cursor: "pointer" }}>
                    {u.avatar} {u.name.split(" ")[0]} <span style={{ opacity: 0.6, fontSize: 11 }}>✕</span>
                  </span>
                ) : null;
              })}
            </div>
          )}
          <input autoFocus value={inviteSearch} onChange={e => setInviteSearch(e.target.value)}
            placeholder="Search friends…"
            style={{ width: "100%", boxSizing: "border-box", border: "1px solid #e8e8e8", borderRadius: 8,
              padding: "8px 12px", fontSize: 13, outline: "none", background: "#fff", color: "#222" }} />
          <div style={{ marginTop: 6 }}>
            {(allUsers || []).filter(u => friendState?.[u.id] === "friend" &&
              (!inviteSearch.trim() || u.name.toLowerCase().includes(inviteSearch.toLowerCase())))
              .map(u => (
                <div key={u.id} onClick={() => onInviteFriend(u.id)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px",
                    cursor: "pointer", borderRadius: 8 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f0f0"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontSize: 18 }}>{u.avatar}</span>
                  <span style={{ fontSize: 13, color: "#222", flex: 1 }}>{u.name}</span>
                  {(trip.invitedFriends || []).includes(u.id) && <span style={{ color: "#22c55e", fontSize: 13 }}>✓</span>}
                </div>
              ))}
          </div>
          <button onClick={() => { setShowInviteDropdown(false); setInviteSearch(""); }}
            style={{ marginTop: 10, width: "100%", background: "#111", border: "none", borderRadius: 8,
              padding: "9px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Done
          </button>
        </div>
      )}

      {/* ── SHARE PANEL (inline, triggered from ⋯) ── */}
      {showShareDropdown && (
        <div onClick={e => e.stopPropagation()}
          style={{ margin: "0 20px 16px", background: "#fafafa", border: "1px solid #efefef",
            borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 10, letterSpacing: "0.04em" }}>
            🔗 SHARE TRIP
          </div>
          {(trip.sharedWith || []).length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
              {(trip.sharedWith || []).map(uid => {
                const u = (allUsers || []).find(x => x.id === uid);
                return u ? (
                  <span key={uid} onClick={() => onShare(uid)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#111",
                      color: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 12, cursor: "pointer" }}>
                    {u.avatar} {u.name.split(" ")[0]} <span style={{ opacity: 0.6, fontSize: 11 }}>✕</span>
                  </span>
                ) : null;
              })}
            </div>
          )}
          <input autoFocus value={shareSearch} onChange={e => setShareSearch(e.target.value)}
            placeholder="Search friends…"
            style={{ width: "100%", boxSizing: "border-box", border: "1px solid #e8e8e8", borderRadius: 8,
              padding: "8px 12px", fontSize: 13, outline: "none", background: "#fff", color: "#222" }} />
          <div style={{ marginTop: 6 }}>
            {(allUsers || []).filter(u => friendState?.[u.id] === "friend" &&
              (!shareSearch.trim() || u.name.toLowerCase().includes(shareSearch.toLowerCase())))
              .map(u => (
                <div key={u.id} onClick={() => onShare(u.id)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px",
                    cursor: "pointer", borderRadius: 8 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0f0f0"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontSize: 18 }}>{u.avatar}</span>
                  <span style={{ fontSize: 13, color: "#222", flex: 1 }}>{u.name}</span>
                  {(trip.sharedWith || []).includes(u.id) && <span style={{ color: "#22c55e", fontSize: 13 }}>✓</span>}
                </div>
              ))}
          </div>
          <button onClick={() => { setShowShareDropdown(false); setShareSearch(""); }}
            style={{ marginTop: 10, width: "100%", background: "#111", border: "none", borderRadius: 8,
              padding: "9px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Done
          </button>
        </div>
      )}

      {/* ── EXPANDED BODY ── */}
      {expanded && trip.plan && (
        <div style={{ borderTop: "1px solid #f0f0f0" }}>

          {/* Mini map preview */}
          {trip.plan.days.some(d => (d.entries || d.items || []).length > 0) && (
            <MiniTripMap trip={trip} onOpenFull={() => setShowMapModal(true)} />
          )}

          {/* Progress bar */}
          {totalPlaces > 0 && (
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f5f5f5" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.07em", textTransform: "uppercase" }}>Progress</span>
                <span style={{ fontSize: 12, color: "#888" }}>
                  {visitedCount} / {totalPlaces} visited
                  {visitedCount === totalPlaces && totalPlaces > 0 && " 🎉"}
                </span>
              </div>
              <div style={{ height: 5, background: "#f0f0f0", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.round((visitedCount / totalPlaces) * 100)}%`,
                  background: visitedCount === totalPlaces ? "#22c55e" : "#111", borderRadius: 3,
                  transition: "width 0.4s ease" }} />
              </div>
            </div>
          )}

          {/* Utility sections */}
          <div ref={utilitySectionRef}>
          <div style={{ padding: "12px 20px", display: "flex", gap: 8, borderBottom: "1px solid #f5f5f5", flexWrap: "wrap" }}>
            {!past && <>
              <button onClick={e => { e.stopPropagation(); setShowBookRemind(v => !v); }}
                style={{ display: "flex", alignItems: "center", gap: 6, background: showBookRemind ? "#111" : "#f5f5f5",
                  border: "none", borderRadius: 10, padding: "7px 13px", cursor: "pointer",
                  fontSize: 12, fontWeight: 500, color: showBookRemind ? "#fff" : "#555", transition: "all 0.15s" }}>
                📋 Book & Reserve
                {(trip.reminders || []).length > 0 && (
                  <span style={{ background: showBookRemind ? "rgba(255,255,255,0.25)" : "#ddd", borderRadius: 20,
                    padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>
                    {(trip.reminders || []).length}
                  </span>
                )}
              </button>
              <button onClick={e => { e.stopPropagation(); setShowPackList(v => !v); }}
                style={{ display: "flex", alignItems: "center", gap: 6, background: showPackList ? "#111" : "#f5f5f5",
                  border: "none", borderRadius: 10, padding: "7px 13px", cursor: "pointer",
                  fontSize: 12, fontWeight: 500, color: showPackList ? "#fff" : "#555", transition: "all 0.15s" }}>
                🎒 Pack List
                {(trip.packList || []).length > 0 && (
                  <span style={{ background: showPackList ? "rgba(255,255,255,0.25)" : "#ddd", borderRadius: 20,
                    padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>
                    {(trip.packList || []).filter(x => x.packed).length}/{(trip.packList || []).length}
                  </span>
                )}
              </button>
            </>}
            <button onClick={e => { e.stopPropagation(); setShowIdeasNote(v => !v); }}
              style={{ display: "flex", alignItems: "center", gap: 6, background: showIdeasNote ? "#111" : "#f5f5f5",
                border: "none", borderRadius: 10, padding: "7px 13px", cursor: "pointer",
                fontSize: 12, fontWeight: 500, color: showIdeasNote ? "#fff" : "#555", transition: "all 0.15s" }}>
              📝 Notes
              {(trip.ideasNotes || []).length > 0 && (
                <span style={{ background: showIdeasNote ? "rgba(255,255,255,0.25)" : "#ddd", borderRadius: 20,
                  padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>
                  {(trip.ideasNotes || []).length}
                </span>
              )}
            </button>
          </div>

          {/* Book & Reserve panel */}
          {showBookRemind && !past && (
            <div onClick={e => e.stopPropagation()}
              style={{ padding: "12px 20px 16px", borderBottom: "1px solid #f5f5f5", background: "#fafafa" }}>
              {(trip.reminders || []).length === 0 && (
                <div style={{ fontSize: 12, color: "#bbb", fontStyle: "italic", marginBottom: 8 }}>No notes yet</div>
              )}
              {(trip.reminders || []).map(r => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
                  background: "#fff", borderRadius: 10, padding: "9px 12px", border: "1px solid #f0f0f0" }}>
                  <div style={{ flex: 1, fontSize: 13, color: "#222" }}>{r.text}</div>
                  <button onClick={() => onUpdate && onUpdate({ ...trip, reminders: (trip.reminders || []).filter(x => x.id !== r.id) })}
                    style={{ background: "none", border: "none", color: "#ccc", fontSize: 16, cursor: "pointer", lineHeight: 1, padding: "0 2px" }}>×</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <input value={newReminderText} onChange={e => setNewReminderText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && newReminderText.trim()) {
                      onUpdate && onUpdate({ ...trip, reminders: [...(trip.reminders || []), { id: "r_" + Date.now(), text: newReminderText.trim() }] });
                      setNewReminderText("");
                    }
                  }}
                  placeholder="e.g. Book restaurant reservation"
                  style={{ flex: 1, background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
                    padding: "8px 12px", fontSize: 12, color: "#222", outline: "none" }} />
                <button onClick={() => {
                  if (!newReminderText.trim()) return;
                  onUpdate && onUpdate({ ...trip, reminders: [...(trip.reminders || []), { id: "r_" + Date.now(), text: newReminderText.trim() }] });
                  setNewReminderText("");
                }} style={{ background: "#111", border: "none", borderRadius: 8, padding: "8px 14px",
                  color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>+ Add</button>
              </div>
            </div>
          )}

          {/* Pack List panel */}
          {showPackList && !past && (
            <div onClick={e => e.stopPropagation()}
              style={{ padding: "12px 20px 16px", borderBottom: "1px solid #f5f5f5", background: "#fafafa" }}>
              {(trip.packList || []).length === 0 && (
                <div style={{ fontSize: 12, color: "#bbb", fontStyle: "italic", marginBottom: 8 }}>Nothing added yet</div>
              )}
              {(trip.packList || []).map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6,
                  background: "#fff", borderRadius: 10, padding: "9px 12px", border: "1px solid #f0f0f0" }}>
                  <input type="checkbox" checked={item.packed} onChange={() =>
                    onUpdate && onUpdate({ ...trip, packList: (trip.packList || []).map(x => x.id === item.id ? { ...x, packed: !x.packed } : x) })}
                    style={{ cursor: "pointer", accentColor: "#111", width: 15, height: 15 }} />
                  <span style={{ flex: 1, fontSize: 13, color: item.packed ? "#bbb" : "#222",
                    textDecoration: item.packed ? "line-through" : "none" }}>{item.text}</span>
                  <button onClick={() => onUpdate && onUpdate({ ...trip, packList: (trip.packList || []).filter(x => x.id !== item.id) })}
                    style={{ background: "none", border: "none", color: "#ddd", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
                </div>
              ))}
              {/* Template picker */}
              <button onClick={() => setShowTemplatePicker(v => !v)}
                style={{ background: showTemplatePicker ? "#000" : "#f0f0f0", border: "none", borderRadius: 8,
                  padding: "6px 12px", fontSize: 11, color: showTemplatePicker ? "#fff" : "#555",
                  cursor: "pointer", fontWeight: 600, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                📋 Use Template {showTemplatePicker ? "▲" : "▼"}
              </button>
              {showTemplatePicker && (
                <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12,
                  padding: "12px", marginBottom: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Choose a template — items will be added to your list</div>
                  {Object.entries(PACK_LIST_TEMPLATES).map(([label, items]) => (
                    <button key={label} onClick={() => {
                      const existing = (trip.packList || []).map(x => x.text.toLowerCase());
                      const newItems = items.filter(i => !existing.includes(i.toLowerCase()))
                        .map(text => ({ id: "p_" + Date.now() + "_" + Math.random(), text, packed: false }));
                      if (newItems.length) onUpdate && onUpdate({ ...trip, packList: [...(trip.packList || []), ...newItems] });
                      setShowTemplatePicker(false);
                    }} style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8,
                      padding: "8px 12px", fontSize: 12, color: "#333", cursor: "pointer",
                      textAlign: "left", fontWeight: 500, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{label}</span>
                      <span style={{ fontSize: 11, color: "#aaa" }}>{items.length} items →</span>
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                <input value={newPackItem} onChange={e => setNewPackItem(e.target.value)}
                  placeholder="e.g. Passport, sunscreen, hiking boots…"
                  onKeyDown={e => {
                    if (e.key === "Enter" && newPackItem.trim()) {
                      onUpdate && onUpdate({ ...trip, packList: [...(trip.packList || []), { id: "p_" + Date.now(), text: newPackItem.trim(), packed: false }] });
                      setNewPackItem("");
                    }
                  }}
                  style={{ flex: 1, background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
                    padding: "8px 12px", fontSize: 12, color: "#222", outline: "none" }} />
                <button onClick={() => {
                  if (!newPackItem.trim()) return;
                  onUpdate && onUpdate({ ...trip, packList: [...(trip.packList || []), { id: "p_" + Date.now(), text: newPackItem.trim(), packed: false }] });
                  setNewPackItem("");
                }} style={{ background: "#111", border: "none", borderRadius: 8, padding: "8px 14px",
                  color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>+ Add</button>
              </div>
            </div>
          )}

          {/* Notes panel */}
          {showIdeasNote && (
            <div onClick={e => e.stopPropagation()}
              style={{ padding: "12px 20px 16px", borderBottom: "1px solid #f5f5f5", background: "#fafafa" }}>
              <div style={{ fontSize: 11, color: "#aaa", marginBottom: 10 }}>
                Jot down places, restaurants, or activities you want to explore — assign them to a day later.
              </div>
              {(trip.ideasNotes || []).length === 0 && (
                <div style={{ fontSize: 12, color: "#bbb", fontStyle: "italic", marginBottom: 8 }}>No ideas yet</div>
              )}
              {(trip.ideasNotes || []).map(idea => (
                <div key={idea.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6,
                  background: "#fff", borderRadius: 10, padding: "9px 12px", border: "1px solid #f0f0f0" }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
                  <div style={{ flex: 1, fontSize: 13, color: "#222" }}>{idea.text}</div>
                  <button onClick={() => onUpdate && onUpdate({ ...trip, ideasNotes: (trip.ideasNotes || []).filter(x => x.id !== idea.id) })}
                    style={{ background: "none", border: "none", color: "#ccc", fontSize: 16, cursor: "pointer", lineHeight: 1, padding: "0 2px" }}>×</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <input value={newIdeaText} onChange={e => setNewIdeaText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && newIdeaText.trim()) {
                      onUpdate && onUpdate({ ...trip, ideasNotes: [...(trip.ideasNotes || []), { id: "n_" + Date.now(), text: newIdeaText.trim() }] });
                      setNewIdeaText("");
                    }
                  }}
                  placeholder="e.g. Try the local markets, visit old town…"
                  style={{ flex: 1, background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8,
                    padding: "8px 12px", fontSize: 12, color: "#222", outline: "none" }} />
                <button onClick={() => {
                  if (!newIdeaText.trim()) return;
                  onUpdate && onUpdate({ ...trip, ideasNotes: [...(trip.ideasNotes || []), { id: "n_" + Date.now(), text: newIdeaText.trim() }] });
                  setNewIdeaText("");
                }} style={{ background: "#111", border: "none", borderRadius: 8, padding: "8px 14px",
                  color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>+ Add</button>
              </div>
            </div>
          )}

          </div>{/* end utilitySectionRef */}

          {/* ── TIMELINE ── */}
          <div style={{ padding: "20px 20px 24px" }}>
            {/* Collapse all / Expand all — only show for trips with 3+ days */}
            {allDaysCount >= 3 && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                <button onClick={() => setCollapsedDays(allCollapsed ? new Set() : new Set(trip.plan.days.map((_, i) => i)))}
                  style={{ background: "none", border: "1px solid #e8e8e8", borderRadius: 20,
                    padding: "4px 12px", fontSize: 11, color: "#888", cursor: "pointer" }}>
                  {allCollapsed ? "↕ Expand all" : "↕ Collapse all"}
                </button>
              </div>
            )}

            {trip.plan.days.map((day, dayIdx) => {
              const dayColor = DAY_COLORS[dayIdx % DAY_COLORS.length];
              const dayEntries = day.entries || day.items || [];
              const isLast = dayIdx === trip.plan.days.length - 1;
              const isDayCollapsed = collapsedDays.has(dayIdx);
              const dayDate = trip.startDate ? (() => {
                const d = new Date(trip.startDate + "T12:00:00");
                d.setDate(d.getDate() + dayIdx);
                return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
              })() : null;
              const visitedCount = dayEntries.filter(e => e.visited).length;

              return (
                <div key={dayIdx} style={{ display: "flex", gap: 0, marginBottom: isLast ? 0 : isDayCollapsed ? 12 : 28 }}>
                  {/* Timeline spine */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
                    marginRight: 16, flexShrink: 0, width: 28 }}>
                    <div onClick={() => toggleDayCollapse(dayIdx)}
                      style={{ width: 28, height: 28, borderRadius: "50%", background: dayColor,
                        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 800, flexShrink: 0, zIndex: 1,
                        boxShadow: `0 0 0 3px ${dayColor}22`, cursor: "pointer",
                        opacity: isDayCollapsed ? 0.65 : 1, transition: "opacity 0.15s" }}>
                      {dayIdx + 1}
                    </div>
                    {!isLast && (
                      <div style={{ width: 2, flex: 1, background: `${dayColor}30`, marginTop: 6,
                        minHeight: isDayCollapsed ? 8 : 20, borderRadius: 1 }} />
                    )}
                  </div>

                  {/* Day content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Day header row — always visible, clicking name toggles collapse */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                      marginBottom: isDayCollapsed ? 0 : 10, gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                        onClick={() => toggleDayCollapse(dayIdx)}>
                        {editing && !isDayCollapsed ? (
                          <input
                            value={day.name || ("Day " + (dayIdx + 1) + (day.city ? " — " + day.city : ""))}
                            onChange={e => updateDayName(dayIdx, e.target.value)}
                            onClick={e => e.stopPropagation()}
                            style={{ fontSize: 14, fontWeight: 700, color: "#111", border: "1.5px solid #e0e0e0",
                              borderRadius: 8, padding: "4px 10px", width: "100%", background: "#fafafa", outline: "none" }}
                          />
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#111", lineHeight: 1.3 }}>
                              {day.name || ("Day " + (dayIdx + 1) + (day.city ? " — " + day.city : ""))}
                            </div>
                            <span style={{ fontSize: 11, color: "#bbb", transition: "transform 0.15s",
                              display: "inline-block", transform: isDayCollapsed ? "rotate(-90deg)" : "rotate(0deg)" }}>
                              ▾
                            </span>
                          </div>
                        )}
                        {dayDate && <div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>{dayDate}</div>}
                        {/* Collapsed summary */}
                        {isDayCollapsed && dayEntries.length > 0 && (
                          <div style={{ fontSize: 11, color: "#aaa", marginTop: 3 }}>
                            {dayEntries.length} place{dayEntries.length !== 1 ? "s" : ""}
                            {visitedCount > 0 ? ` · ${visitedCount} visited` : ""}
                            {" · "}
                            <span style={{ color: "#bbb" }}>
                              {dayEntries.slice(0, 2).map(e => e.name).join(", ")}
                              {dayEntries.length > 2 ? ` +${dayEntries.length - 2}` : ""}
                            </span>
                          </div>
                        )}
                        {isDayCollapsed && dayEntries.length === 0 && (
                          <div style={{ fontSize: 11, color: "#ddd", marginTop: 3 }}>No places yet</div>
                        )}
                      </div>
                      {!isDayCollapsed && <DayMapButton day={day} />}
                    </div>

                    {/* Collapsible body */}
                    {!isDayCollapsed && (<>

                    {/* Day notes */}
                    {!past && onUpdate ? (
                      <textarea value={day.notes || ""} onChange={e => updateDayNotes(dayIdx, e.target.value)}
                        onClick={e => e.stopPropagation()} placeholder="Notes for this day…" rows={1}
                        style={{ width: "100%", boxSizing: "border-box", fontSize: 12, color: "#666",
                          border: "1.5px solid #f0f0f0", borderRadius: 8, padding: "6px 10px", marginBottom: 8,
                          background: "#fafafa", resize: "none", outline: "none", lineHeight: 1.5 }} />
                    ) : day.notes ? (
                      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8, fontStyle: "italic", lineHeight: 1.5 }}>
                        {day.notes}
                      </div>
                    ) : null}

                    {/* Place cards */}
                    {dayEntries.map((e, entIdx) => (
                      <div key={e.id}>
                        {/* Distance connector from previous stop */}
                        {entIdx > 0 && (e.distanceFromPrev || e.travelTimeFromPrev) && (
                          <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "0 0 6px 18px" }}>
                            <div style={{ width: 1, height: 14, background: "#e0e0e0" }} />
                            <span style={{ fontSize: 10, color: "#bbb", fontWeight: 500 }}>
                              {[e.distanceFromPrev, e.travelTimeFromPrev].filter(Boolean).join(" · ")}
                            </span>
                          </div>
                        )}
                      <div onClick={ev => ev.stopPropagation()}
                        style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "11px 13px",
                          marginBottom: 6, background: e.visited ? "#fafafa" : "#fff",
                          border: `1px solid ${e.visited ? "#f0f0f0" : "#efefef"}`,
                          borderRadius: 14, opacity: e.visited ? 0.6 : 1, transition: "all 0.15s",
                          boxShadow: e.visited ? "none" : "0 1px 3px rgba(0,0,0,0.04)" }}>

                        {/* Type icon thumbnail */}
                        <div style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                          background: dayColor + "18", display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: 20 }}>
                          {{ restaurant: "🍽", hotel: "🏨", brewery: "🍺", cafe: "☕", activity: "🏔", hiking: "🥾" }[e.type] || "📍"}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#111",
                            textDecoration: e.visited ? "line-through" : "none", lineHeight: 1.3 }}>
                            <a
                              href={e.lat && e.lon
                                ? `https://www.google.com/maps/search/?api=1&query=${e.lat},${e.lon}`
                                : `https://www.google.com/maps/search/${encodeURIComponent([e.name, e.city, e.state].filter(Boolean).join(" "))}`}
                              target="_blank" rel="noopener noreferrer"
                              onClick={ev => ev.stopPropagation()}
                              style={{ color: "inherit", textDecoration: "none" }}
                            >
                              {e.name} <span style={{ color: "#4285f4", fontSize: 11 }}>↗</span>
                            </a>
                          </div>
                          <div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>
                            {[e.cuisine || e.type, e.city].filter(Boolean).join(" · ")}
                          </div>
                          {e.verdict && (
                            <div style={{ marginTop: 5 }}>
                              <VerdictBadge verdict={e.verdict} />
                            </div>
                          )}
                          {e.notes && (
                            <div style={{ fontSize: 11, color: "#ccc", marginTop: 4, fontStyle: "italic" }}>{e.notes}</div>
                          )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                          {/* Visit toggle */}
                          {onUpdate && (
                            <button onClick={() => toggleVisited(dayIdx, e.id)}
                              title={e.visited ? "Mark unvisited" : "Mark visited"}
                              style={{ width: 32, height: 32, borderRadius: 8, cursor: "pointer",
                                border: `1.5px solid ${e.visited ? "#22c55e" : "#e0e0e0"}`,
                                background: e.visited ? "#f0fdf4" : "transparent",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 16, color: e.visited ? "#22c55e" : "#d0d0d0", transition: "all 0.15s" }}>
                              ✓
                            </button>
                          )}
                          {/* Log to diary */}
                          {onImportSingle && (
                            <button onClick={() => onImportSingle(e)} title="Log to diary"
                              style={{ height: 32, borderRadius: 8, cursor: "pointer",
                                border: "1.5px solid #c8a882", background: "#fdf6f0",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 13, fontWeight: 700, color: "#b07040", padding: "0 10px",
                                letterSpacing: "0.03em" }}>
                              Log
                            </button>
                          )}
                          {/* Move to day */}
                          {onUpdate && trip.plan.days.length > 1 && (
                            <MoveDaySelect
                              days={trip.plan.days}
                              currentDayIdx={dayIdx}
                              onMove={toDayIdx => movePlace(dayIdx, e.id, toDayIdx)}
                            />
                          )}
                          {/* Remove */}
                          {onUpdate && (
                            <button onClick={() => removePlace(dayIdx, e.id)} title="Remove place"
                              style={{ width: 32, height: 32, borderRadius: 8, cursor: "pointer",
                                border: "1.5px solid #e0e0e0", background: "transparent",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 18, color: "#d0d0d0", lineHeight: 1 }}>
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                      </div>
                    ))}

                    {/* Add place input with suggestions */}
                    {!past && onUpdate && (
                      <AddPlaceInput
                        entries={entries}
                        trip={trip}
                        onAdd={entry => {
                          if (!onUpdate) return;
                          const newEntry = entry.id
                            ? { ...entry, id: "q_" + Date.now() }
                            : { id: "q_" + Date.now(), name: entry.name.trim(), type: entry.type || "activity", city: entry.city || trip.destination, state: entry.state || "", verdict: entry.verdict || "must_go", cuisine: entry.cuisine || "" };
                          const newDays = trip.plan.days.map((d, i) =>
                            i === dayIdx ? { ...d, entries: [...(d.entries || d.items || []), newEntry] } : d
                          );
                          onUpdate({ ...trip, plan: { ...trip.plan, days: newDays } });
                        }}
                      />
                    )}
                    </>)}
                  </div>
                </div>
              );
            })}

            {editing && (
              <button onClick={() => setEditing(false)}
                style={{ width: "100%", background: "#111", border: "none", borderRadius: 12, padding: "11px",
                  color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 12 }}>
                Done Editing
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── OVERFLOW MENU (portal) ── */}
      {showOverflowMenu && overflowMenuPos && createPortal(
        <div onClick={e => e.stopPropagation()}
          style={{ position: "absolute", top: overflowMenuPos.top, right: overflowMenuPos.right,
            background: "#fff", borderRadius: 14, boxShadow: "0 8px 40px rgba(0,0,0,0.16)",
            border: "1px solid #f0f0f0", minWidth: 215, zIndex: 9000, padding: "6px 0",
            overflow: "hidden" }}>
          <OMenuItem icon="🗺" label="Full Map View" onClick={() => { setShowOverflowMenu(false); setShowMapModal(true); setExpanded(true); }} />
          {!past && onEdit && <OMenuItem icon="✏️" label="Edit Trip" onClick={() => { setShowOverflowMenu(false); onEdit(); }} />}
          {!past && onInviteFriend && <OMenuItem icon="👥" label="Invite Friends" onClick={() => { setShowOverflowMenu(false); setShowInviteDropdown(true); setExpanded(true); }} />}
          {past && onShare && <OMenuItem icon="🔗" label="Share Trip" onClick={() => { setShowOverflowMenu(false); setShowShareDropdown(true); setExpanded(true); }} />}
          {onImportToLogs && <OMenuItem icon="📍" label="Import All to Logs" onClick={() => { setShowOverflowMenu(false); onImportToLogs(); }} />}
          {past && onReactivate && <OMenuItem icon="↩" label="Move to Current" onClick={() => { setShowOverflowMenu(false); onReactivate(); }} />}

          <div style={{ height: 1, background: "#f5f5f5", margin: "4px 0" }} />

          {!past && onComplete && !confirmingComplete && !completePhotoStep && (
            <OMenuItem icon="✓" label="Mark as Done" onClick={() => setConfirmingComplete(true)} />
          )}
          {!past && onComplete && confirmingComplete && !completePhotoStep && (
            <div style={{ padding: "8px 16px" }}>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>Move to Past Trips?</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { setConfirmingComplete(false); setCompletePhotoStep(true); }}
                  style={{ flex: 1, background: "#111", border: "none", borderRadius: 8, padding: "7px",
                    color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Yes</button>
                <button onClick={() => setConfirmingComplete(false)}
                  style={{ flex: 1, background: "#f5f5f5", border: "none", borderRadius: 8, padding: "7px",
                    color: "#555", fontSize: 12, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
          {!past && onComplete && completePhotoStep && (
            <div style={{ padding: "10px 16px" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 4 }}>Add a cover photo?</div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 10, lineHeight: 1.5 }}>
                Pick a photo from this trip — it'll appear on your Home screen and Trips page.
              </div>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                background: "#000", border: "none", borderRadius: 8, padding: "9px",
                color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 6 }}>
                📷 Choose Photo
                <input type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = ev => {
                      onComplete(ev.target.result);
                      setCompletePhotoStep(false);
                      setShowOverflowMenu(false);
                    };
                    reader.readAsDataURL(file);
                  }} />
              </label>
              <button onClick={() => { onComplete(null); setCompletePhotoStep(false); setShowOverflowMenu(false); }}
                style={{ width: "100%", background: "#f5f5f5", border: "none", borderRadius: 8, padding: "7px",
                  color: "#888", fontSize: 12, cursor: "pointer" }}>
                Skip — use destination photo
              </button>
            </div>
          )}
          {!confirmingDelete ? (
            <OMenuItem icon="🗑" label="Delete Trip" onClick={() => setConfirmingDelete(true)} danger />
          ) : (
            <div style={{ padding: "8px 16px" }}>
              <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 8 }}>Delete this trip?</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { onDelete(); setShowOverflowMenu(false); }}
                  style={{ flex: 1, background: "#ef4444", border: "none", borderRadius: 8, padding: "7px",
                    color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Delete</button>
                <button onClick={() => setConfirmingDelete(false)}
                  style={{ flex: 1, background: "#f5f5f5", border: "none", borderRadius: 8, padding: "7px",
                    color: "#555", fontSize: 12, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* Map modal */}
      {showMapModal && (
        <TripMapModal trip={trip} onClose={() => setShowMapModal(false)} />
      )}
    </div>
  );
}

// ─── PLACE PHOTO HELPERS ─────────────────────────────────────────────────────
const CUISINE_PHOTOS = {
  // Food
  "Thai":          "photo-1559314809-0d155014e29e",
  "Japanese":      "photo-1569050467447-ce54b3bbc37d",
  "Chinese":       "photo-1563245372-f21724e3856d",
  "Mexican":       "photo-1565299585323-38d6b0865b47",
  "Indian":        "photo-1585937421612-70a008356fbe",
  "Nepalese":      "photo-1585937421612-70a008356fbe",
  "American":      "photo-1568901346375-23c9450c58cd",
  "Korean":        "photo-1498654896293-37aacf113fd9",
  "Italian":       "photo-1555396273-367ea4eb4db5",
  "Vietnamese":    "photo-1576577445504-6af96477db52",
  "Mediterranean": "photo-1544025162-d76538720b72",
  "Coffee":        "photo-1509042239860-f550ce710b93",
  "cafe":          "photo-1509042239860-f550ce710b93",
  "brewery":       "photo-1535958536851-beb9e9b65e7f",
  "restaurant":    "photo-1414235077428-338989a2e8c0",
  // Activities
  "hiking":        "photo-1551632811-561732d1e306",
  "scenic":        "photo-1506905925346-21bda4d32df4",
  "outdoor":       "photo-1441974231531-c6227db76b6e",
  "kids":          "photo-1575783970733-1aaedde1db74",
  "park":          "photo-1519331379826-f10be5486c6f",
  "museum":        "photo-1554907984-15263bfd63bd",
  "landmark":      "photo-1502602898657-3e91760cbb34",
  "neighborhood":  "photo-1477959858617-67f85cf4f1df",
  "activity":      "photo-1526401485004-73d51899b6a8",
};

function getPlacePhoto(entry) {
  const key = entry.cuisine || entry.type || "restaurant";
  const photoId = CUISINE_PHOTOS[key] || CUISINE_PHOTOS["restaurant"];
  return `https://images.unsplash.com/${photoId}?w=400&h=200&fit=crop&auto=format`;
}

// ─── EXPLORE TAB COMPONENT ───────────────────────────────────────────────────
function ExploreTab({ entries, savedTrips, onAddToTrip, onViewProfile, savedBookmarks, onToggleBookmark, currentUserId }) {
  const [exploreTab, setExploreTab] = useState("network"); // network | foryou
  // Network filters
  const [networkCategory, setNetworkCategory] = useState("all");
  const [networkSearch, setNetworkSearch] = useState("");
  const [networkVerdict, setNetworkVerdict] = useState("all");
  const [networkSort, setNetworkSort] = useState("recent"); // recent | rating | bookmarked
  const [networkMinRating, setNetworkMinRating] = useState(0);

  const allUsers = ALL_USERS;
  // Friends entries only (not current user u1)
  const networkEntries = entries.filter(e => e.userId !== currentUserId && !e.isActivity);

  const filteredNetwork = networkEntries.filter(e => {
    if (networkSearch.trim()) {
      const q = networkSearch.toLowerCase();
      if (!entryMatchesSearch(e, q)) return false;
    }
    if (networkVerdict !== "all" && e.verdict !== networkVerdict) return false;
    if (networkMinRating > 0 && (e.rating || 0) < networkMinRating) return false;
    if (networkSort === "bookmarked" && !(savedBookmarks || new Set()).has(e.id)) return false;
    if (networkCategory === "hotel") return e.type === "hotel";
    if (networkCategory === "food") return ["restaurant","cafe","brewery"].includes(e.type);
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
  }).sort((a, b) => {
    if (networkSort === "rating") return (b.rating || 0) - (a.rating || 0);
    return 0; // default: original order (most recent last in mock data)
  });

  // "For You" recommendations: must_go entries your friends logged that you haven't logged
  const myLoggedNames = new Set(entries.filter(e => e.userId === currentUserId).map(e => e.name.toLowerCase()));
  const forYouEntries = networkEntries
    .filter(e => e.verdict === "must_go" && !myLoggedNames.has(e.name.toLowerCase()))
    .reduce((acc, e) => { // deduplicate by name
      if (!acc.find(x => x.name.toLowerCase() === e.name.toLowerCase())) acc.push(e);
      return acc;
    }, [])
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 12);

  // For hiking/kids/activities in network tab, use MOCK_ACTIVITIES
  const networkActivities = entries.filter(e => {
    if (e.userId === currentUserId) return false;
    if (!e.isActivity) return false;
    if (networkCategory === "hiking") return e.type === "hiking";
    if (networkCategory === "kids") return e.type === "kids";
    if (networkCategory === "activities") return e.type === "scenic" || e.type === "outdoor";
    return false;
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
      {/* Main tabs: Network | For You */}
      <div style={{ display: "flex", gap: 0, marginBottom: 16, background: "#f0f0f0", borderRadius: 10, padding: 3 }}>
        {[["network", "👥 Network"], ["foryou", "💡 For You"]].map(([id, label]) => (
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
            {catBtn("hotel", networkCategory, setNetworkCategory, "🏨 Hotel")}
            {catBtn("hiking", networkCategory, setNetworkCategory, "🥾 Hiking")}
            {catBtn("kids", networkCategory, setNetworkCategory, "👶 Kids")}
            {catBtn("activities", networkCategory, setNetworkCategory, "⛺ Activities")}
          </div>

          {/* Verdict filter for food */}
          {networkCategory === "food" && (
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
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

          {/* Sort + Rating filter row */}
          {(networkCategory === "all" || networkCategory === "food") && (
            <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "#aaa", flexShrink: 0 }}>Sort:</span>
              {[["recent","Recent"],["rating","Top Rated"],["bookmarked","⭐ Saved"]].map(([v,l]) => (
                <button key={v} onClick={() => setNetworkSort(v)}
                  style={{ background: networkSort === v ? "#000" : "#f8f8f8",
                    border: `1px solid ${networkSort === v ? "#000" : "#efefef"}`,
                    color: networkSort === v ? "#fff" : "#555",
                    borderRadius: 20, padding: "5px 12px", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap" }}>
                  {l}
                </button>
              ))}
              <span style={{ fontSize: 11, color: "#aaa", marginLeft: 4, flexShrink: 0 }}>Min ★:</span>
              {[0,3,4,5].map(r => (
                <button key={r} onClick={() => setNetworkMinRating(r)}
                  style={{ background: networkMinRating === r ? "#000" : "#f8f8f8",
                    border: `1px solid ${networkMinRating === r ? "#000" : "#efefef"}`,
                    color: networkMinRating === r ? "#fff" : "#555",
                    borderRadius: 20, padding: "5px 10px", cursor: "pointer", fontSize: 11 }}>
                  {r === 0 ? "All" : r + "+"}
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

          {/* Entries — 2-column photo grid */}
          {(networkCategory === "all" || networkCategory === "food") && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {filteredNetwork.length === 0 ? (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px", color: "#aaa" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
                  <div style={{ fontSize: 14 }}>{networkSort === "bookmarked" ? "No saved places yet — bookmark entries below" : "No results found"}</div>
                </div>
              ) : filteredNetwork.map(e => {
                const user = allUsers.find(u => u.id === e.userId);
                const isBookmarked = (savedBookmarks || new Set()).has(e.id);
                return (
                  <div key={e.id} style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
                    {/* Photo — friend's own if available, else generic */}
                    <div style={{ position: "relative", height: 120, overflow: "hidden", flexShrink: 0 }}>
                      <img src={(e.photos && e.photos.length > 0) ? e.photos[0] : getPlacePhoto(e)} alt={e.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={ev => { ev.target.style.display = "none"; ev.target.parentNode.style.background = "#f0f0f0"; }} />
                      <button onClick={() => onToggleBookmark && onToggleBookmark(e.id)}
                        title={isBookmarked ? "Remove bookmark" : "Save"}
                        style={{ position: "absolute", top: 6, right: 6, background: isBookmarked ? "#fffbeb" : "rgba(255,255,255,0.85)", border: `1px solid ${isBookmarked ? "#fde68a" : "#e8e8e8"}`, borderRadius: 6, padding: "3px 7px", fontSize: 12, cursor: "pointer", color: isBookmarked ? "#d97706" : "#aaa", lineHeight: 1 }}>
                        {isBookmarked ? "★" : "☆"}
                      </button>
                    </div>
                    {/* Info */}
                    <div style={{ padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 4 }}>
                        <a href={`https://www.google.com/maps/search/${encodeURIComponent(e.name + ' ' + (e.city || ''))}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={ev => ev.stopPropagation()}
                          style={{ color: "#000", fontSize: 13, fontWeight: 700, textDecoration: "none", lineHeight: 1.3, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                          onMouseEnter={ev => ev.currentTarget.style.textDecoration = "underline"}
                          onMouseLeave={ev => ev.currentTarget.style.textDecoration = "none"}>
                          {e.name} <span style={{ color: "#4285f4", fontSize: 11, fontWeight: 400 }}>↗</span>
                        </a>
                        <StarRating value={e.rating} size={11} />
                      </div>
                      <div style={{ fontSize: 11, color: "#888", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                        {e.city}, {e.state} · {e.cuisine || e.type}
                      </div>
                      {e.verdict && <VerdictBadge verdict={e.verdict} />}
                      {e.notes && (
                        <div style={{ fontSize: 11, color: "#999", fontStyle: "italic", lineHeight: 1.4, marginTop: 2 }}>
                          "{e.notes.length > 80 ? e.notes.slice(0, 80) + "…" : e.notes}"
                        </div>
                      )}
                      {(e.photos && e.photos.length > 0) && (
                        <div style={{ marginTop: 4 }}><PhotoStrip photos={e.photos} inline /></div>
                      )}
                      {user && (
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4, borderTop: "1px solid #f0f0f0", paddingTop: 6 }}>
                          <span style={{ fontSize: 12 }}>{user.avatar}</span>
                          <span onClick={ev => { ev.stopPropagation(); onViewProfile && onViewProfile(user.id); }}
                            style={{ color: "#555", fontSize: 10, cursor: "pointer", textDecoration: "underline", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                            @{user.username}
                          </span>
                        </div>
                      )}
                      {savedTrips && savedTrips.filter(t => !t.completed).length > 0 && (
                        <select onChange={ev => { if (ev.target.value && onAddToTrip) { onAddToTrip(ev.target.value, e); ev.target.value = ""; }}}
                          style={{ marginTop: 4, background: "#000", color: "#fff", border: "none", borderRadius: 6, padding: "4px 6px", fontSize: 10, cursor: "pointer", width: "100%" }}
                          defaultValue="">
                          <option value="" disabled>+ Add to Trip</option>
                          {savedTrips.filter(t => !t.completed).map(t => (
                            <option key={t.id} value={t.id}>{t.destination}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Activities — 2-column photo grid */}
          {(networkCategory === "hiking" || networkCategory === "kids" || networkCategory === "activities") && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {networkActivities.length === 0 ? (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px", color: "#aaa" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🏔</div>
                  <div style={{ fontSize: 14 }}>No {networkCategory} from your network</div>
                </div>
              ) : networkActivities.map(e => {
                const user = allUsers.find(u => u.id === e.userId);
                const isBookmarked = (savedBookmarks || new Set()).has(e.id);
                return (
                  <div key={e.id} style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
                    {/* Photo — friend's own if available, else generic */}
                    <div style={{ position: "relative", height: 120, overflow: "hidden", flexShrink: 0 }}>
                      <img src={(e.photos && e.photos.length > 0) ? e.photos[0] : getPlacePhoto(e)} alt={e.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={ev => { ev.target.style.display = "none"; ev.target.parentNode.style.background = "#f0f0f0"; }} />
                      <button onClick={() => onToggleBookmark && onToggleBookmark(e.id)}
                        title={isBookmarked ? "Remove bookmark" : "Save"}
                        style={{ position: "absolute", top: 6, right: 6, background: isBookmarked ? "#fffbeb" : "rgba(255,255,255,0.85)", border: `1px solid ${isBookmarked ? "#fde68a" : "#e8e8e8"}`, borderRadius: 6, padding: "3px 7px", fontSize: 12, cursor: "pointer", color: isBookmarked ? "#d97706" : "#aaa", lineHeight: 1 }}>
                        {isBookmarked ? "★" : "☆"}
                      </button>
                    </div>
                    {/* Info */}
                    <div style={{ padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 4 }}>
                        <a href={`https://www.google.com/maps/search/${encodeURIComponent(e.name + ' ' + (e.city || ''))}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={ev => ev.stopPropagation()}
                          style={{ color: "#000", fontSize: 13, fontWeight: 700, textDecoration: "none", lineHeight: 1.3, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                          onMouseEnter={ev => ev.currentTarget.style.textDecoration = "underline"}
                          onMouseLeave={ev => ev.currentTarget.style.textDecoration = "none"}>
                          {e.name} <span style={{ color: "#4285f4", fontSize: 11, fontWeight: 400 }}>↗</span>
                        </a>
                        <StarRating value={e.rating} size={11} />
                      </div>
                      <div style={{ fontSize: 11, color: "#888", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                        {e.city}, {e.state} · {e.type}
                      </div>
                      {e.difficulty && (
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#555", background: "#f0f0f0", borderRadius: 4, padding: "2px 6px", alignSelf: "flex-start" }}>{e.difficulty}</span>
                      )}
                      {e.notes && (
                        <div style={{ fontSize: 11, color: "#999", fontStyle: "italic", lineHeight: 1.4, marginTop: 2 }}>
                          "{e.notes.length > 80 ? e.notes.slice(0, 80) + "…" : e.notes}"
                        </div>
                      )}
                      {(e.photos && e.photos.length > 0) && (
                        <div style={{ marginTop: 4 }}><PhotoStrip photos={e.photos} inline /></div>
                      )}
                      {user && (
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4, borderTop: "1px solid #f0f0f0", paddingTop: 6 }}>
                          <span style={{ fontSize: 12 }}>{user.avatar}</span>
                          <span onClick={ev => { ev.stopPropagation(); onViewProfile && onViewProfile(user.id); }}
                            style={{ color: "#555", fontSize: 10, cursor: "pointer", textDecoration: "underline", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                            @{user.username}
                          </span>
                        </div>
                      )}
                      {savedTrips && savedTrips.filter(t => !t.completed).length > 0 && (
                        <select onChange={ev => { if (ev.target.value && onAddToTrip) { onAddToTrip(ev.target.value, e); ev.target.value = ""; }}}
                          style={{ marginTop: 4, background: "#000", color: "#fff", border: "none", borderRadius: 6, padding: "4px 6px", fontSize: 10, cursor: "pointer", width: "100%" }}
                          defaultValue="">
                          <option value="" disabled>+ Add to Trip</option>
                          {savedTrips.filter(t => !t.completed).map(t => (
                            <option key={t.id} value={t.id}>{t.destination}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* FOR YOU TAB */}
      {exploreTab === "foryou" && (
        <div>
          {/* Results count */}
          <div style={{ fontSize: 12, color: "#888", marginBottom: 12, fontWeight: 500 }}>
            {forYouEntries.length} picks from your network
          </div>

          {/* 2-column photo grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {forYouEntries.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px", color: "#aaa" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>💡</div>
                <div style={{ fontSize: 14 }}>No new recommendations yet</div>
                <div style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>Follow more friends to get personalized picks</div>
              </div>
            ) : forYouEntries.map((e, i) => {
              const user = allUsers.find(u => u.id === e.userId);
              const isBookmarked = (savedBookmarks || new Set()).has(e.id);
              return (
                <div key={e.id} style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
                  {/* Photo */}
                  <div style={{ position: "relative", height: 120, overflow: "hidden", flexShrink: 0 }}>
                    <img src={getPlacePhoto(e)} alt={e.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={ev => { ev.target.style.display = "none"; ev.target.parentNode.style.background = "#f0f0f0"; }} />
                    {i < 3 && (
                      <div style={{ position: "absolute", top: 6, left: 6, zIndex: 2,
                        background: i === 0 ? "#FFB800" : i === 1 ? "#9ca3af" : "#b45309",
                        color: "#fff", borderRadius: 20, fontSize: 9, fontWeight: 800, padding: "2px 7px" }}>
                        #{i + 1}
                      </div>
                    )}
                    <button onClick={() => onToggleBookmark && onToggleBookmark(e.id)}
                      title={isBookmarked ? "Remove bookmark" : "Save"}
                      style={{ position: "absolute", top: 6, right: 6, background: isBookmarked ? "#fffbeb" : "rgba(255,255,255,0.85)", border: `1px solid ${isBookmarked ? "#fde68a" : "#e8e8e8"}`, borderRadius: 6, padding: "3px 7px", fontSize: 12, cursor: "pointer", color: isBookmarked ? "#d97706" : "#aaa", lineHeight: 1 }}>
                      {isBookmarked ? "★" : "☆"}
                    </button>
                  </div>
                  {/* Info */}
                  <div style={{ padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 4 }}>
                      <a href={`https://www.google.com/maps/search/${encodeURIComponent(e.name + ' ' + (e.city || ''))}`}
                        target="_blank" rel="noopener noreferrer"
                        onClick={ev => ev.stopPropagation()}
                        style={{ color: "#000", fontSize: 13, fontWeight: 700, textDecoration: "none", lineHeight: 1.3, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                        onMouseEnter={ev => ev.currentTarget.style.textDecoration = "underline"}
                        onMouseLeave={ev => ev.currentTarget.style.textDecoration = "none"}>
                        {e.name} <span style={{ color: "#4285f4", fontSize: 11, fontWeight: 400 }}>↗</span>
                      </a>
                      <StarRating value={e.rating} size={11} />
                    </div>
                    <div style={{ fontSize: 11, color: "#888", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                      {e.city}, {e.state} · {e.cuisine || e.type}
                    </div>
                    {e.verdict && <VerdictBadge verdict={e.verdict} />}
                    {e.notes && (
                      <div style={{ fontSize: 11, color: "#999", fontStyle: "italic", lineHeight: 1.4, marginTop: 2 }}>
                        "{e.notes.length > 80 ? e.notes.slice(0, 80) + "…" : e.notes}"
                      </div>
                    )}
                    {user && (
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4, borderTop: "1px solid #f0f0f0", paddingTop: 6 }}>
                        <span style={{ fontSize: 12 }}>{user.avatar}</span>
                        <span onClick={ev => { ev.stopPropagation(); onViewProfile && onViewProfile(user.id); }}
                          style={{ color: "#555", fontSize: 10, cursor: "pointer", textDecoration: "underline", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                          @{user.username}
                        </span>
                      </div>
                    )}
                    {savedTrips && savedTrips.filter(t => !t.completed).length > 0 && (
                      <select onChange={ev => { if (ev.target.value && onAddToTrip) { onAddToTrip(ev.target.value, e); ev.target.value = ""; }}}
                        style={{ marginTop: 4, background: "#000", color: "#fff", border: "none", borderRadius: 6, padding: "4px 6px", fontSize: 10, cursor: "pointer", width: "100%" }}
                        defaultValue="">
                        <option value="" disabled>+ Add to Trip</option>
                        {savedTrips.filter(t => !t.completed).map(t => (
                          <option key={t.id} value={t.id}>{t.destination}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DESTINATION PHOTO (Unsplash via backend proxy, cached) ──────────────────
const _destPhotoCache = {};
const _DEST_FALLBACK = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=80";

function DestinationPhoto({ destination, coverPhoto, style }) {
  const [src, setSrc] = useState(coverPhoto || _DEST_FALLBACK);
  useEffect(() => {
    if (coverPhoto) { setSrc(coverPhoto); return; }
    if (!destination) return;
    const key = destination.trim();
    if (_destPhotoCache[key]) { setSrc(_destPhotoCache[key]); return; }
    fetch(`/api/destination-photo?destination=${encodeURIComponent(key)}`)
      .then(r => r.json())
      .then(data => {
        if (data?.url) { _destPhotoCache[key] = data.url; setSrc(data.url); }
      })
      .catch(() => {});
  }, [destination, coverPhoto]);
  return <img src={src} alt={destination} style={style} />;
}

// ─── HOME TAB COMPONENT ──────────────────────────────────────────────────────
function HomeTab({ currentUser, savedTrips, entries, allUsers, onGoToTrips, onGoToExplore, onGoToTrip, onUpdateCoverPhoto, onViewProfile }) {
  const SERIF = "'Lora', 'Georgia', serif";
  const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  const FOOD_PHOTOS = [
    "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80",
    "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
  ];

  const upcomingTrips = (savedTrips || []).filter(t => !t.completed).slice(0, 3);
  const friendEntries = entries.filter(e => e.userId !== currentUser.id && !e.isActivity).slice(-4).reverse();
  const pastTrips = (savedTrips || []).filter(t => t.completed).slice(-4).reverse();
  // eslint-disable-next-line no-unused-vars
  const myEntries = entries.filter(e => e.userId === currentUser.id);

  const verdictLabel = { must_go: "Must Go", liked: "Liked", meh: "Meh", avoid: "Avoid" };
  const verdictBg    = { must_go: "#E8873A", liked: "#16a34a", meh: "#d97706", avoid: "#ef4444" };

  const SectionHeader = ({ title, onSeeAll }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, color: "#9e8878", textTransform: "uppercase", letterSpacing: "0.1em" }}>{title}</div>
      {onSeeAll && <button onClick={onSeeAll} style={{ background: "none", border: "none", fontFamily: SANS, fontSize: 12, color: "#b09e94", cursor: "pointer", padding: 0 }}>See all →</button>}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Greeting */}
      <div style={{ paddingTop: 6 }}>
        <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: "#1a0a00", lineHeight: 1.2 }}>
          Hey, {currentUser.name.split(" ")[0]} {currentUser.avatar}
        </div>
      </div>

      {/* ── Upcoming Trips ── */}
      <div>
        <SectionHeader title="Upcoming Trips" onSeeAll={onGoToTrips} />
        {upcomingTrips.length === 0 ? (
          <div style={{ background: "rgba(61,31,20,0.04)", border: "1px dashed #d8cfc7", borderRadius: 18, padding: "28px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: SERIF, fontSize: 15, color: "#9e8878", marginBottom: 12 }}>No trips planned yet</div>
            <button onClick={onGoToTrips} style={{ background: "#3d1f14", border: "none", borderRadius: 10, padding: "9px 20px", color: "#fff", fontFamily: SANS, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              + Plan a Trip
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {upcomingTrips.map((trip, i) => {
              let daysAway = null;
              if (trip.startDate) {
                const diff = Math.ceil((new Date(trip.startDate + "T12:00:00") - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
                daysAway = diff;
              }
              const isHero = i === 0;
              const hasPackList = (trip.packList || []).length > 0;
              const hasReminders = (trip.reminders || []).length > 0;
              const packedCount = (trip.packList||[]).filter(x => x.packed).length;
              const totalPack = (trip.packList||[]).length;
              const packPct = totalPack > 0 ? (packedCount / totalPack) * 100 : 0;
              if (isHero) {
                return (
                  <div key={trip.id} onClick={onGoToTrips} style={{
                    position: "relative", borderRadius: 20, overflow: "hidden",
                    height: 190, cursor: "pointer",
                    boxShadow: "0 6px 28px rgba(0,0,0,0.22)"
                  }}>
                    <DestinationPhoto destination={trip.destination} coverPhoto={trip.coverPhoto}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.60) 100%)" }} />
                    {daysAway !== null && (
                      <div style={{ position: "absolute", top: 16, right: 18, textAlign: "center" }}>
                        <div style={{ fontFamily: SANS, fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                          {daysAway <= 0 ? "🛫" : daysAway}
                        </div>
                        <div style={{ fontFamily: SANS, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.72)", marginTop: 3 }}>
                          {daysAway <= 0 ? "Today!" : daysAway === 1 ? "Day Away" : "Days Away"}
                        </div>
                      </div>
                    )}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 18px 16px" }}>
                      <div style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 4 }}>
                        ✈ {trip.destination}
                      </div>
                      <div style={{ fontFamily: SANS, fontSize: 12, color: "rgba(255,255,255,0.72)", marginBottom: hasPackList ? 10 : 0 }}>
                        {trip.days} days
                        {trip.startDate ? ` · ${new Date(trip.startDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
                        {trip.invitedFriends?.length > 0 ? ` · ${trip.invitedFriends.length} going` : ""}
                      </div>
                      {hasPackList && (
                        <button onClick={e => { e.stopPropagation(); onGoToTrip && onGoToTrip(trip.id, "packList"); }}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", width: "100%" }}>
                          <div style={{ fontFamily: SANS, fontSize: 11, color: "rgba(255,255,255,0.82)", marginBottom: 5 }}>
                            🎒 {packedCount}/{totalPack} packed
                          </div>
                          <div style={{ height: 4, background: "rgba(255,255,255,0.22)", borderRadius: 4, overflow: "hidden", width: "100%" }}>
                            <div style={{ height: "100%", width: `${packPct}%`, background: "#e879a0", borderRadius: 4 }} />
                          </div>
                        </button>
                      )}
                      {hasReminders && (
                        <button onClick={e => { e.stopPropagation(); onGoToTrip && onGoToTrip(trip.id, "bookRemind"); }}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", marginTop: hasPackList ? 6 : 0 }}>
                          <div style={{ fontFamily: SANS, fontSize: 11, color: "rgba(255,255,255,0.72)" }}>
                            📋 {(trip.reminders||[]).length} to book
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={trip.id} onClick={onGoToTrips} style={{
                    position: "relative", borderRadius: 16, overflow: "hidden",
                    height: 88, cursor: "pointer",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.14)"
                  }}>
                    <DestinationPhoto destination={trip.destination} coverPhoto={trip.coverPhoto}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.12) 100%)" }} />
                    <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
                      <div>
                        <div style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 700, color: "#fff" }}>{trip.destination}</div>
                        <div style={{ fontFamily: SANS, fontSize: 11, color: "rgba(255,255,255,0.68)", marginTop: 2 }}>
                          {trip.days} days{trip.startDate ? ` · ${new Date(trip.startDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
                        </div>
                      </div>
                      {daysAway !== null && (
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: SANS, fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{daysAway <= 0 ? "🛫" : daysAway}</div>
                          <div style={{ fontFamily: SANS, fontSize: 9, fontWeight: 600, textTransform: "uppercase", color: "rgba(255,255,255,0.62)", marginTop: 2 }}>
                            {daysAway <= 0 ? "Today" : "Days Away"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>

      {/* ── Friends Activity ── */}
      <div>
        <SectionHeader title="Friends Activity" onSeeAll={onGoToExplore} />
        {friendEntries.length === 0 ? (
          <div style={{ background: "rgba(61,31,20,0.04)", border: "1px dashed #d8cfc7", borderRadius: 16, padding: "24px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>👥</div>
            <div style={{ fontFamily: SANS, fontSize: 13, color: "#9e8878" }}>No recent activity from friends</div>
          </div>
        ) : (
          <div className="home-photo-scroll" style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
            {friendEntries.map((e, idx) => {
              const user = allUsers.find(u => u.id === e.userId);
              const foodPhoto = FOOD_PHOTOS[idx % FOOD_PHOTOS.length];
              const bg = verdictBg[e.verdict] || "#E8873A";
              const vLabel = verdictLabel[e.verdict] || "";
              return (
                <div key={e.id} onClick={() => onViewProfile && user && onViewProfile(user.id)}
                  style={{
                    width: 148, flexShrink: 0, borderRadius: 16, overflow: "hidden",
                    boxShadow: "0 3px 14px rgba(0,0,0,0.16)",
                    cursor: "pointer", display: "flex", flexDirection: "column",
                    background: "#fff"
                  }}>
                  {/* Photo */}
                  <div style={{ position: "relative", height: 130, flexShrink: 0 }}>
                    <img src={foodPhoto} alt={e.name}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    {/* Gradient */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
                      background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)" }} />
                    {/* Avatar top-right */}
                    {user && (
                      <button onClick={ev => { ev.stopPropagation(); onViewProfile && onViewProfile(user.id); }}
                        title={`View @${user.username}`}
                        style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30,
                          background: "#f0ebe6", borderRadius: "50%", border: "2px solid #fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 14, overflow: "hidden", boxShadow: "0 1px 5px rgba(0,0,0,0.22)",
                          cursor: "pointer", padding: 0 }}>
                        {user.avatarImg
                          ? <img src={user.avatarImg} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : user.avatar}
                      </button>
                    )}
                    {/* Place name — opens this specific entry */}
                    <div style={{ position: "absolute", bottom: 28, left: 8, right: 8,
                        fontFamily: SERIF, fontSize: 12, fontWeight: 700, color: "#fff",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {e.name}
                    </div>
                    {/* Verdict badge — own line at very bottom */}
                    {e.verdict && (
                      <div style={{ position: "absolute", bottom: 8, left: 8,
                        background: bg, color: "#fff",
                        fontFamily: SANS, fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                        letterSpacing: "0.06em", borderRadius: 8, padding: "3px 8px" }}>
                        {vLabel}
                      </div>
                    )}
                  </div>
                  {/* Info strip */}
                  <div style={{ padding: "7px 10px", display: "flex", alignItems: "center", gap: 7, borderTop: "1px solid #f5f0ec" }}>
                    {user && (
                      <div style={{ width: 22, height: 22, background: "#f0ebe6", borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, flexShrink: 0, overflow: "hidden" }}>
                        {user.avatarImg
                          ? <img src={user.avatarImg} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : user.avatar}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, color: "#3d1f14",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        @{user?.username || ""}
                      </div>
                      {(e.city || e.state) && (
                        <div style={{ fontFamily: SANS, fontSize: 9, color: "#9e8878", marginTop: 1,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {[e.city, e.state].filter(Boolean).join(", ")}
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

      {/* ── Past Trips ── */}
      {pastTrips.length > 0 && (
        <div>
          <SectionHeader title="Past Trips" onSeeAll={onGoToTrips} />
          <div style={{ display: "flex", gap: 10 }}>
            {pastTrips.slice(0, 2).map(trip => {
              const dateLabel = trip.startDate
                ? (() => {
                    const s = new Date(trip.startDate + "T12:00:00");
                    const endDate = trip.endDate ? new Date(trip.endDate + "T12:00:00") : null;
                    if (endDate) {
                      return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
                    }
                    return s.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                  })()
                : null;
              return (
                <div key={trip.id} style={{
                  flex: 1, position: "relative", height: 132, borderRadius: 16, overflow: "hidden",
                  cursor: "pointer", boxShadow: "0 3px 14px rgba(0,0,0,0.18)"
                }}>
                  <DestinationPhoto destination={trip.destination} coverPhoto={trip.coverPhoto}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <div onClick={onGoToTrips} style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.04) 60%)" }} />
                  {/* 📷 Change photo button */}
                  <label title="Change cover photo" style={{
                    position: "absolute", top: 8, right: 8,
                    background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8,
                    padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                    color: "#fff", fontSize: 11, fontFamily: SANS, fontWeight: 600,
                    zIndex: 2
                  }}>
                    📷
                    <input type="file" accept="image/*" style={{ display: "none" }}
                      onChange={e => {
                        const file = e.target.files[0];
                        if (!file || !onUpdateCoverPhoto) return;
                        const reader = new FileReader();
                        reader.onload = ev => onUpdateCoverPhoto(trip.id, ev.target.result);
                        reader.readAsDataURL(file);
                      }} />
                  </label>
                  <div onClick={onGoToTrips} style={{ position: "absolute", bottom: 11, left: 12, right: 8 }}>
                    <div style={{ fontFamily: SERIF, fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{trip.destination}</div>
                    {dateLabel && <div style={{ fontFamily: SANS, fontSize: 10, color: "rgba(255,255,255,0.72)", marginTop: 2 }}>{dateLabel}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

// ─── MY LOGS TAB COMPONENT ───────────────────────────────────────────────────
function MyLogsTab({ entries, currentUser, savedTrips, setEntries, setEditingEntry, showImport, setShowImport, onEditProfile, onGoToTrips, savedBookmarks, onToggleBookmark }) {
  const [myLogsView, setMyLogsView] = useState("logs"); // "logs" | "saved"
  const [logsCategory, setLogsCategory] = useState("all");
  const [logsSearch, setLogsSearch] = useState("");
  const [importResult, setImportResult] = useState(null);
  const [logsVerdictFilter, setLogsVerdictFilter] = useState(null);
  const [logsCityFilter, setLogsCityFilter] = useState(null);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [logsCountryFilter, setLogsCountryFilter] = useState(null);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [logsStateFilter, setLogsStateFilter] = useState(null);
  const myEntries = entries.filter(e => e.userId === currentUser.id);
  const savedEntries = savedBookmarks && savedBookmarks.size > 0
    ? entries.filter(e => savedBookmarks.has(e.id))
    : [];
  const myCities = [...new Set(myEntries.map(e => e.city).filter(Boolean))].sort();
  const myCountries = [...new Set(myEntries.map(e => e.country).filter(Boolean))].sort();
  const myStates = [...new Set(myEntries.filter(e => e.country === "USA" || e.country === "US" || !e.country).map(e => e.state).filter(Boolean))].sort();

  // eslint-disable-next-line no-unused-vars
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
      if (!entryMatchesSearch(e, q)) return false;
    }
    if (logsVerdictFilter && e.verdict !== logsVerdictFilter) return false;
    if (logsCityFilter && e.city !== logsCityFilter) return false;
    if (logsCountryFilter && e.country !== logsCountryFilter) return false;
    if (logsStateFilter && e.state !== logsStateFilter) return false;
    if (logsCategory === "food") return ["restaurant","cafe","brewery"].includes(e.type);
    if (logsCategory === "hotel") return e.type === "hotel";
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
          <div style={{ width: 52, height: 52, background: "#f0f0f0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, overflow: "hidden", flexShrink: 0 }}>
            {currentUser.avatarImg
              ? <img src={currentUser.avatarImg} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : currentUser.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#000" }}>{currentUser.name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>@{currentUser.username}</div>
            {currentUser.bio && <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>{currentUser.bio}</div>}
          </div>
          <button onClick={onEditProfile}
            style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8, padding: "6px 12px",
              fontSize: 11, color: "#555", cursor: "pointer", flexShrink: 0 }}>
            ✏️ Edit Profile
          </button>
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
          {[
            { label: "Logs", value: myEntries.length, action: () => { setLogsVerdictFilter(null); setLogsCityFilter(null); setLogsCountryFilter(null); setLogsStateFilter(null); setShowCityPicker(false); setShowCountryPicker(false); setShowStatePicker(false); }, active: !logsVerdictFilter && !logsCityFilter && !logsCountryFilter && !logsStateFilter },
            { label: "Must Go", value: myEntries.filter(e=>e.verdict==="must_go").length, action: () => { setLogsVerdictFilter(logsVerdictFilter === "must_go" ? null : "must_go"); setShowCityPicker(false); setShowCountryPicker(false); setShowStatePicker(false); }, active: logsVerdictFilter === "must_go" },
            { label: "Cities", value: myCities.length, action: () => { setShowCityPicker(s => !s); setShowCountryPicker(false); setShowStatePicker(false); }, active: showCityPicker || !!logsCityFilter },
            { label: "States", value: myStates.length, action: () => { setShowStatePicker(s => !s); setShowCityPicker(false); setShowCountryPicker(false); }, active: showStatePicker || !!logsStateFilter },
            { label: "Countries", value: myCountries.length, action: () => { setShowCountryPicker(s => !s); setShowCityPicker(false); setShowStatePicker(false); }, active: showCountryPicker || !!logsCountryFilter },
            { label: "Trips", value: savedTrips.length, action: onGoToTrips, active: false },
          ].map(({ label, value, action, active }) => (
            <div key={label} onClick={action || undefined}
              style={{ cursor: action ? "pointer" : "default" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: active ? "#000" : "#000" }}>{value}</div>
              <div style={{ fontSize: 11, color: active ? "#000" : "#888", fontWeight: active ? 700 : 400, borderBottom: active ? "2px solid #000" : "2px solid transparent", paddingBottom: 1, transition: "all 0.15s" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* City picker — shown when Cities stat is tapped */}
        {showCityPicker && (
          <div style={{ marginTop: 14, borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Filter by City</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {logsCityFilter && (
                <button onClick={() => setLogsCityFilter(null)}
                  style={{ background: "#f8f8f8", border: "1px solid #ddd", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#555", cursor: "pointer" }}>
                  ✕ Clear
                </button>
              )}
              {myCities.map(c => {
                const count = myEntries.filter(e => e.city === c).length;
                return (
                  <button key={c} onClick={() => setLogsCityFilter(logsCityFilter === c ? null : c)}
                    style={{ background: logsCityFilter === c ? "#000" : "#f8f8f8",
                      border: `1px solid ${logsCityFilter === c ? "#000" : "#e8e8e8"}`,
                      color: logsCityFilter === c ? "#fff" : "#444",
                      borderRadius: 20, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>
                    📍 {c} <span style={{ opacity: 0.6 }}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* State picker — shown when States stat is tapped */}
        {showStatePicker && (
          <div style={{ marginTop: 14, borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>US States Visited ({myStates.length})</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {logsStateFilter && (
                <button onClick={() => setLogsStateFilter(null)}
                  style={{ background: "#f8f8f8", border: "1px solid #ddd", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#555", cursor: "pointer" }}>
                  ✕ Clear
                </button>
              )}
              {myStates.map(s => {
                const count = myEntries.filter(e => e.state === s).length;
                return (
                  <button key={s} onClick={() => setLogsStateFilter(logsStateFilter === s ? null : s)}
                    style={{ background: logsStateFilter === s ? "#000" : "#f8f8f8",
                      border: `1px solid ${logsStateFilter === s ? "#000" : "#e8e8e8"}`,
                      color: logsStateFilter === s ? "#fff" : "#444",
                      borderRadius: 20, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>
                    🇺🇸 {s} <span style={{ opacity: 0.6 }}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Country picker — shown when Countries stat is tapped */}
        {showCountryPicker && (
          <div style={{ marginTop: 14, borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Countries Visited ({myCountries.length})</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {logsCountryFilter && (
                <button onClick={() => setLogsCountryFilter(null)}
                  style={{ background: "#f8f8f8", border: "1px solid #ddd", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#555", cursor: "pointer" }}>
                  ✕ Clear
                </button>
              )}
              {myCountries.map(c => {
                const count = myEntries.filter(e => e.country === c).length;
                return (
                  <button key={c} onClick={() => setLogsCountryFilter(logsCountryFilter === c ? null : c)}
                    style={{ background: logsCountryFilter === c ? "#000" : "#f8f8f8",
                      border: `1px solid ${logsCountryFilter === c ? "#000" : "#e8e8e8"}`,
                      color: logsCountryFilter === c ? "#fff" : "#444",
                      borderRadius: 20, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>
                    🌍 {c} <span style={{ opacity: 0.6 }}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* My Logs / Saved tab switcher */}
      <div style={{ display: "flex", gap: 0, marginBottom: 18, background: "#f0f0f0", borderRadius: 10, padding: 3 }}>
        {[["logs", "My Logs"], ["saved", `Saved (${savedEntries.length})`]].map(([id, label]) => (
          <button key={id} onClick={() => setMyLogsView(id)}
            style={{ flex: 1, background: myLogsView === id ? "#fff" : "transparent",
              border: "none", borderRadius: 8, padding: "10px 8px", cursor: "pointer",
              color: myLogsView === id ? "#000" : "#888", fontWeight: myLogsView === id ? 600 : 400,
              fontSize: 13, boxShadow: myLogsView === id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.2s" }}>
            {label}
          </button>
        ))}
      </div>

      {/* SAVED VIEW */}
      {myLogsView === "saved" && (
        <div>
          {savedEntries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "52px 20px", color: "#aaa", background: "#fafafa", borderRadius: 16, border: "1px dashed #e8e8e8" }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>⭐</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#555", marginBottom: 4 }}>No saved places yet</div>
              <div style={{ fontSize: 13, color: "#aaa" }}>Tap ☆ on any place in the Network feed to save it here</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {savedEntries.map(e => {
                const user = ALL_USERS.find(u => u.id === e.userId);
                return (
                  <div key={e.id} style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
                    <div style={{ position: "relative", height: 120, overflow: "hidden", flexShrink: 0 }}>
                      <img src={(e.photos && e.photos.length > 0) ? e.photos[0] : getPlacePhoto(e)} alt={e.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={ev => { ev.target.style.display = "none"; ev.target.parentNode.style.background = "#f0f0f0"; }} />
                      <button onClick={() => onToggleBookmark && onToggleBookmark(e.id)}
                        title="Remove from saved"
                        style={{ position: "absolute", top: 6, right: 6, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 6, padding: "3px 7px", fontSize: 12, cursor: "pointer", color: "#d97706", lineHeight: 1 }}>
                        ★
                      </button>
                    </div>
                    <div style={{ padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 4 }}>
                        <a href={`https://www.google.com/maps/search/${encodeURIComponent(e.name + ' ' + (e.city || ''))}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={ev => ev.stopPropagation()}
                          style={{ color: "#000", fontSize: 13, fontWeight: 700, textDecoration: "none", lineHeight: 1.3 }}
                          onMouseEnter={ev => ev.currentTarget.style.textDecoration = "underline"}
                          onMouseLeave={ev => ev.currentTarget.style.textDecoration = "none"}>
                          {e.name} <span style={{ color: "#4285f4", fontSize: 11, fontWeight: 400 }}>↗</span>
                        </a>
                        <StarRating value={e.rating} size={11} />
                      </div>
                      <div style={{ fontSize: 11, color: "#888" }}>
                        {e.city}{e.state ? `, ${e.state}` : ""} · {e.cuisine || e.type}
                      </div>
                      {e.difficulty && (
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#555", background: "#f0f0f0", borderRadius: 4, padding: "2px 6px", alignSelf: "flex-start" }}>{e.difficulty}</span>
                      )}
                      {e.verdict && <VerdictBadge verdict={e.verdict} />}
                      {e.notes && (
                        <div style={{ fontSize: 11, color: "#999", fontStyle: "italic", lineHeight: 1.4, marginTop: 2 }}>
                          "{e.notes.length > 80 ? e.notes.slice(0, 80) + "…" : e.notes}"
                        </div>
                      )}
                      {user && (
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4, borderTop: "1px solid #f0f0f0", paddingTop: 6 }}>
                          <span style={{ fontSize: 12 }}>{user.avatar}</span>
                          <span style={{ color: "#555", fontSize: 10, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                            @{user.username}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MY LOGS VIEW */}
      {myLogsView === "logs" && (
      <div>

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
              {importResult.slice(0, 3).map((h) => (
                <div key={h.name} style={{ fontSize: 12, color: "#555", padding: "4px 0", borderBottom: "1px solid #efefef" }}>
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
        {catBtn("hotel", "🏨 Hotel")}
        {catBtn("hiking", "🥾 Hiking")}
        {catBtn("kids", "👶 Kids")}
        {catBtn("activities", "⛺ Activities")}
      </div>

      {/* Count */}
      <div style={{ fontSize: 12, color: "#888", marginBottom: 12, fontWeight: 500 }}>
        {filteredLogs.length} {logsCategory === "all" ? "logs" : logsCategory}
      </div>

      {/* Entries — 2-column photo grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {filteredLogs.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "52px 20px", color: "#aaa", background: "#fafafa", borderRadius: 16, border: "1px dashed #e8e8e8" }}>
            <div style={{ fontSize: 44, marginBottom: 12, filter: "grayscale(0.2)" }}>📍</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#555", marginBottom: 4 }}>{logsSearch ? "No results found" : "Nothing logged yet"}</div>
            {!logsSearch && <div style={{ fontSize: 13, color: "#aaa" }}>Tap <strong>+ Log</strong> to start building your food diary</div>}
          </div>
        ) : filteredLogs.map(e => (
          <div key={e.id} style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
            {/* Photo — user's own if available, else generic */}
            <div style={{ position: "relative", height: 120, overflow: "hidden", flexShrink: 0 }}>
              <img src={(e.photos && e.photos.length > 0) ? e.photos[0] : getPlacePhoto(e)} alt={e.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={ev => { ev.target.style.display = "none"; ev.target.parentNode.style.background = "#f0f0f0"; }} />
              {e.isPrivate && (
                <span style={{ position: "absolute", top: 6, left: 6, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 9, borderRadius: 4, padding: "2px 6px", fontWeight: 600 }}>🔒 Private</span>
              )}
              <button onClick={() => setEditingEntry(e)}
                title="Edit"
                style={{ position: "absolute", top: 6, right: 6, background: "rgba(255,255,255,0.85)", border: "1px solid #e8e8e8", borderRadius: 6, padding: "3px 7px", fontSize: 12, cursor: "pointer", color: "#555", lineHeight: 1 }}>
                ✏️
              </button>
            </div>
            {/* Info */}
            <div style={{ padding: "10px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 4 }}>
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(e.name + ' ' + (e.city || ''))}`}
                  target="_blank" rel="noopener noreferrer"
                  onClick={ev => ev.stopPropagation()}
                  style={{ color: "#000", fontSize: 13, fontWeight: 700, textDecoration: "none", lineHeight: 1.3, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                  onMouseEnter={ev => ev.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={ev => ev.currentTarget.style.textDecoration = "none"}>
                  {e.name} <span style={{ color: "#4285f4", fontSize: 11, fontWeight: 400 }}>↗</span>
                </a>
                <StarRating value={e.rating} size={11} />
              </div>
              <div style={{ fontSize: 11, color: "#888", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                {e.city}{e.state ? `, ${e.state}` : ""} · {e.cuisine || e.type}
              </div>
              {e.difficulty && (
                <span style={{ fontSize: 10, fontWeight: 600, color: "#555", background: "#f0f0f0", borderRadius: 4, padding: "2px 6px", alignSelf: "flex-start" }}>{e.difficulty}</span>
              )}
              {e.verdict && <VerdictBadge verdict={e.verdict} />}
              {e.notes && (
                <div style={{ fontSize: 11, color: "#999", fontStyle: "italic", lineHeight: 1.4, marginTop: 2 }}>
                  "{e.notes.length > 80 ? e.notes.slice(0, 80) + "…" : e.notes}"
                </div>
              )}
              <div style={{ marginTop: 6, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                <PhotoStrip photos={e.photos || []} inline />
                <label style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 8, padding: "5px 10px",
                  color: "#555", fontSize: 11, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  📷
                  <input type="file" accept="image/*" style={{ display: "none" }}
                    onChange={ev => {
                      const file = ev.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = re => setEntries(prev => prev.map(en => en.id === e.id ? {...en, photos: [...(en.photos||[]), re.target.result]} : en));
                      reader.readAsDataURL(file);
                      ev.target.value = "";
                    }} />
                </label>
                <button onClick={() => setEntries(prev => prev.map(en => en.id === e.id ? {...en, isPrivate: !en.isPrivate} : en))}
                  style={{ background: "none", border: "none", padding: 0, fontSize: 10, color: "#aaa", cursor: "pointer", textAlign: "left", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
                  {e.isPrivate ? "🔒 Private" : "🌐 Public"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      )}
    </div>
  );
}


// ─── EDIT PROFILE MODAL ──────────────────────────────────────────────────────
function EditProfileModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.avatar);
  const [avatarImg, setAvatarImg] = useState(user.avatarImg || null);

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type) || file.size > MAX_PHOTO_SIZE) return;
    const reader = new FileReader();
    reader.onload = ev => { setAvatarImg(ev.target.result); };
    reader.readAsDataURL(file);
  };

  const inputStyle = { width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10,
    padding: "11px 12px", fontSize: 14, color: "#000", outline: "none", boxSizing: "border-box" };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: "#888", letterSpacing: "0.06em",
    textTransform: "uppercase", display: "block", marginBottom: 6 };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
      zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", border: "1px solid #efefef", borderRadius: 20, padding: "28px 28px 24px",
        width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto",
        animation: "slideUp 0.22s ease", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Edit Profile</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: "#aaa", cursor: "pointer" }}>×</button>
        </div>

        <div style={{ height: 1, background: "#f0f0f0", marginBottom: 20 }} />

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0f0f0", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 30, overflow: "hidden", flexShrink: 0,
            border: "2px solid #efefef" }}>
            {avatarImg
              ? <img src={avatarImg} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : avatar}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f8f8f8",
              border: "1px dashed #ddd", borderRadius: 8, padding: "7px 14px", fontSize: 12, color: "#555", cursor: "pointer" }}>
              📷 Upload Photo
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
            </label>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input value={avatar} onChange={e => { setAvatar(e.target.value); setAvatarImg(null); }}
                placeholder="or type emoji"
                style={{ ...inputStyle, padding: "6px 10px", fontSize: 20, width: 60, textAlign: "center" }} />
              <span style={{ fontSize: 11, color: "#aaa" }}>or emoji</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={() => onSave({ ...user, name, username, bio, avatar, avatarImg })}
            style={{ flex: 1, background: "#000", border: "none", borderRadius: 10, padding: "12px",
              color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Save Changes
          </button>
          <button onClick={onClose}
            style={{ background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10, padding: "12px 20px",
              fontSize: 14, color: "#555", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATION PANEL ──────────────────────────────────────────────────────
function NotificationPanel({ notifications, onClose, onMarkAllRead, onGoToTrip }) {
  const unreadCount = notifications.filter(n => !n.read).length;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column" }}
      onClick={onClose}>
      <div style={{ position: "absolute", top: 57, right: 0, left: 0, maxWidth: 420, margin: "0 auto",
        background: "#fff", border: "1px solid #efefef", borderRadius: "0 0 16px 16px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)", overflow: "hidden", animation: "slideUp 0.18s ease" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ padding: "14px 18px 10px", borderBottom: "1px solid #f0f0f0",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#000" }}>
            Notifications {unreadCount > 0 && <span style={{ background: "#000", color: "#fff", borderRadius: 20,
              fontSize: 10, padding: "1px 7px", marginLeft: 6, fontWeight: 700 }}>{unreadCount}</span>}
          </div>
          {unreadCount > 0 && (
            <button onClick={onMarkAllRead} style={{ background: "none", border: "none", fontSize: 11,
              color: "#888", cursor: "pointer", padding: 0 }}>Mark all read</button>
          )}
        </div>
        <div style={{ maxHeight: 360, overflowY: "auto" }}>
          {notifications.length === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "#aaa" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔔</div>
              <div style={{ fontSize: 13 }}>No notifications yet</div>
            </div>
          ) : notifications.map(n => (
            <div key={n.id} onClick={() => { if (n.tripId && onGoToTrip) { onGoToTrip(n.tripId, n.section); onClose(); } }}
              style={{ padding: "12px 18px", borderBottom: "1px solid #f8f8f8",
                background: n.read ? "#fff" : "#fafafa",
                cursor: n.tripId ? "pointer" : "default",
                display: "flex", gap: 12, alignItems: "flex-start",
                transition: "background 0.15s" }}>
              <div style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#000", fontWeight: n.read ? 400 : 600, lineHeight: 1.4 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 3 }}>{n.body}</div>
              </div>
              {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#000",
                flexShrink: 0, marginTop: 6 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function buildNotifications(savedTrips, sharedTrips, pendingIncoming, acceptedByThem) {
  const notes = [];
  const today = new Date();
  (savedTrips || []).filter(t => !t.completed).forEach(t => {
    if (t.startDate) {
      const start = new Date(t.startDate + "T12:00:00");
      const days = Math.round((start - today) / 86400000);
      if (days >= 0 && days <= 7) {
        notes.push({ id: "trip_" + t.id, icon: "✈️", title: `${t.destination} in ${days === 0 ? "today!" : days + (days === 1 ? " day" : " days")}`,
          body: "Your trip is coming up. Make sure you're packed!", tripId: t.id, section: "packList", read: false });
      }
    }
    if ((t.bookRemind || []).length > 0) {
      const unbooked = (t.bookRemind || []).filter(r => !r.done);
      if (unbooked.length > 0) {
        notes.push({ id: "book_" + t.id, icon: "📋", title: `${unbooked.length} booking${unbooked.length > 1 ? "s" : ""} to do for ${t.destination}`,
          body: unbooked.slice(0, 2).map(r => r.text).join(" · "), tripId: t.id, section: "bookRemind", read: false });
      }
    }
    const packTotal = (t.packList || []).length;
    const packDone = (t.packList || []).filter(x => x.packed).length;
    if (packTotal > 0 && packDone === packTotal) {
      notes.push({ id: "packed_" + t.id, icon: "🎒", title: `All packed for ${t.destination}!`,
        body: "You're ready. Bon voyage!", tripId: t.id, section: "packList", read: true });
    }
  });
  (sharedTrips || []).slice(0, 2).forEach(t => {
    const sharer = ALL_USERS.find(u => u.id === t.sharedBy);
    notes.push({ id: "shared_" + t.id, icon: "👥", title: `${sharer?.name || "A friend"} shared a trip with you`,
      body: `${t.destination} · ${t.days} day${t.days !== 1 ? "s" : ""}`, read: true });
  });
  // Friend request notifications
  (pendingIncoming || []).forEach(req => {
    notes.push({ id: "freq_" + req.from, icon: "👤",
      title: `${req.profile?.name || "Someone"} sent you a friend request`,
      body: `@${req.profile?.username || req.from} wants to connect`, read: false });
  });
  // Accepted request notifications
  (acceptedByThem || []).forEach(f => {
    notes.push({ id: "facc_" + f.id, icon: "🤝",
      title: `${f.profile?.name || "A traveler"} accepted your friend request`,
      body: `You and @${f.profile?.username || f.id} are now friends`, read: false });
  });
  return notes;
}

// ─── SUPABASE HELPERS ────────────────────────────────────────────────────────
function dbEntryToLocal(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    city: row.city,
    state: row.state,
    country: row.country,
    type: row.type,
    cuisine: row.cuisine,
    dish: row.dish,
    rating: row.rating,
    verdict: row.verdict,
    notes: row.notes,
    tags: row.tags || [],
    photo_url: row.photo_url,
    photos: row.photo_url ? [row.photo_url] : [],
    createdAt: row.created_at,
  };
}

function localEntryToDb(entry, userId) {
  return {
    user_id: userId,
    name: entry.name,
    city: entry.city || null,
    state: entry.state || null,
    country: entry.country || "USA",
    type: entry.type || null,
    cuisine: entry.cuisine || null,
    dish: entry.dish || null,
    rating: entry.rating || null,
    verdict: entry.verdict || null,
    notes: entry.notes || null,
    tags: entry.tags || [],
    photo_url: entry.photo_url || null,
  };
}

function dbTripToLocal(row) {
  const days = (row.trip_days || [])
    .sort((a, b) => a.day_number - b.day_number)
    .map(d => ({
      day: d.day_number,
      name: d.name || `Day ${d.day_number}`,
      city: d.city,
      notes: d.notes || "",
      entries: (d.trip_places || [])
        .sort((a, b) => a.order_idx - b.order_idx)
        .map(p => ({
          id: p.id,
          name: p.name,
          type: p.type,
          city: p.city,
          state: p.state,
          verdict: p.verdict,
          cuisine: p.cuisine,
          distanceFromPrev: p.distance_from_prev,
          travelTimeFromPrev: p.travel_time_from_prev,
          visited: p.visited || false,
          entry_id: p.entry_id,
        })),
    }));

  return {
    id: row.id,
    destination: row.destination,
    days: days.length,
    startDate: row.start_date || "",
    endDate: row.end_date || "",
    createdAt: new Date(row.created_at).toLocaleDateString(),
    completed: row.completed || false,
    notes: row.notes || "",
    coverPhoto: row.cover_photo || null,
    invitedFriends: (row.trip_members || []).filter(m => m.role === "collaborator").map(m => m.user_id),
    sharedWith: (row.trip_members || []).filter(m => m.role === "viewer").map(m => m.user_id),
    packList: (row.pack_list_items || []).sort((a, b) => a.order_idx - b.order_idx).map(i => ({ id: i.id, text: i.text, packed: i.packed })),
    bookRemind: (row.book_remind_items || []).sort((a, b) => a.order_idx - b.order_idx).map(i => ({ id: i.id, text: i.text })),
    collaboratorSuggestions: [],
    ideasNotes: [],
    plan: { days },
  };
}

async function saveTripToDb(trip, userId) {
  // Upsert the trip row
  const { data: tripRow, error: tripErr } = await supabase
    .from("trips")
    .upsert({
      id: trip.id?.startsWith("t") ? undefined : trip.id, // new trips have temp "t..." ids
      user_id: userId,
      destination: trip.destination,
      start_date: trip.startDate || null,
      end_date: trip.endDate || null,
      completed: trip.completed || false,
      notes: trip.notes || null,
      cover_photo: trip.coverPhoto || null,
    }, { onConflict: "id" })
    .select()
    .single();
  if (tripErr) return null;

  const tripId = tripRow.id;

  // Replace days + places (delete then re-insert for simplicity)
  if (trip.plan?.days?.length) {
    await supabase.from("trip_days").delete().eq("trip_id", tripId);
    for (let i = 0; i < trip.plan.days.length; i++) {
      const d = trip.plan.days[i];
      const { data: dayRow } = await supabase.from("trip_days").insert({
        trip_id: tripId, day_number: i + 1, name: d.name || null, city: d.city || null, notes: d.notes || null,
      }).select().single();
      if (dayRow && (d.entries || d.items)?.length) {
        const places = (d.entries || d.items).map((e, j) => ({
          day_id: dayRow.id, entry_id: e.entry_id || null,
          name: e.name, type: e.type || null, city: e.city || null, state: e.state || null,
          verdict: e.verdict || null, cuisine: e.cuisine || null,
          distance_from_prev: e.distanceFromPrev || null, travel_time_from_prev: e.travelTimeFromPrev || null,
          visited: e.visited || false, order_idx: j,
        }));
        await supabase.from("trip_places").insert(places);
      }
    }
  }

  // Pack list
  await supabase.from("pack_list_items").delete().eq("trip_id", tripId);
  if (trip.packList?.length) {
    await supabase.from("pack_list_items").insert(
      trip.packList.map((item, i) => ({ trip_id: tripId, text: item.text, packed: item.packed || false, order_idx: i }))
    );
  }

  // Book & reserve
  await supabase.from("book_remind_items").delete().eq("trip_id", tripId);
  if (trip.bookRemind?.length) {
    await supabase.from("book_remind_items").insert(
      trip.bookRemind.map((item, i) => ({ trip_id: tripId, text: item.text, order_idx: i }))
    );
  }

  return tripId;
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
function MainApp({ user, onLogout }) {
  const [tab, setTab] = useState("home");
  const [showNetwork, setShowNetwork] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [entries, setEntries] = useState([]);
  const [entriesLoaded, setEntriesLoaded] = useState(false); // eslint-disable-line no-unused-vars

  // Load entries from Supabase on mount
  useEffect(() => {
    if (!user) return;
    supabase
      .from("entries")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setEntries(data.map(dbEntryToLocal));
        setEntriesLoaded(true);
      });
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps
  const [showAddModal, setShowAddModal] = useState(false);
  const [prefillEntry, setPrefillEntry] = useState(null);
  const [showTripModal, setShowTripModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [viewProfile, setViewProfile] = useState(null);
  const [friendState, setFriendState] = useState({});
  const [pendingIncoming, setPendingIncoming] = useState([]);
  const [friendProfiles, setFriendProfiles] = useState([]);
  const [acceptedByThem, setAcceptedByThem] = useState([]); // my sent requests that were accepted

  // Load real friendships from Supabase
  useEffect(() => {
    if (!user) return;
    supabase.from("friendships").select("*, profiles!friendships_friend_id_fkey(*), requester:profiles!friendships_user_id_fkey(*)")
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
      .then(({ data }) => {
        if (!data) return;
        const state = {};
        const incoming = [];
        const profiles = [];
        const accepted = [];
        data.forEach(f => {
          const isSender = f.user_id === user.id;
          const otherId = isSender ? f.friend_id : f.user_id;
          const otherProfile = isSender ? f.profiles : f.requester;
          if (f.status === "accepted") {
            state[otherId] = "friend";
            if (otherProfile) profiles.push(otherProfile);
            if (isSender) accepted.push({ id: otherId, profile: otherProfile });
          } else if (f.status === "pending") {
            if (isSender) state[otherId] = "pending";
            else incoming.push({ from: otherId, profile: otherProfile });
          }
        });
        setFriendState(state);
        setPendingIncoming(incoming);
        setFriendProfiles(profiles);
        setAcceptedByThem(accepted);
      });
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const [editingEntry, setEditingEntry] = useState(null);
  const [showImport, setShowImport] = useState(false);
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
  const [tripsLoaded, setTripsLoaded] = useState(false); // eslint-disable-line no-unused-vars

  useEffect(() => {
    if (!user) return;
    supabase
      .from("trips")
      .select(`*, trip_days(*, trip_places(*)), pack_list_items(*), book_remind_items(*), trip_members(user_id, role)`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setSavedTrips(data.map(dbTripToLocal));
        setTripsLoaded(true);
      });
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps
  const [currentUser, setCurrentUser] = useState(() => {
    // Use the real auth user if available, fall back to mock for dev without credentials
    if (user) {
      return {
        id: user.id,
        username: user.user_metadata?.username || user.email?.split("@")[0] || "me",
        name: user.user_metadata?.name || user.email?.split("@")[0] || "You",
        avatar: user.user_metadata?.avatar || "✈️",
        avatarImg: user.user_metadata?.avatar_url || null,
        bio: user.user_metadata?.bio || "",
        tags: [],
      };
    }
    return MOCK_USERS[0];
  });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [focusTripSection, setFocusTripSection] = useState(null); // { tripId, section }
  const tripsPlanningRef = useRef(null);
  const tripsPastRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifIds, setReadNotifIds] = useState(new Set());
  const [savedBookmarks, setSavedBookmarks] = useState(new Set());

  useEffect(() => {
    if (!user) return;
    supabase.from("bookmarks").select("entry_id").eq("user_id", user.id)
      .then(({ data }) => { if (data) setSavedBookmarks(new Set(data.map(b => b.entry_id))); });
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-move trips to past when their end date has passed
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSavedTrips(prev => prev.map(t => {
      if (t.completed) return t;
      if (!t.endDate) return t;
      const end = new Date(t.endDate + "T12:00:00");
      end.setHours(0, 0, 0, 0);
      return end < today ? { ...t, completed: true } : t;
    }));
  }, []);

  const notifications = buildNotifications(savedTrips, sharedTrips, pendingIncoming, acceptedByThem).map(n => ({
    ...n, read: readNotifIds.has(n.id) || n.read
  }));
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  if (viewProfile) {
    const user = ALL_USERS.find(u => u.id === viewProfile);
    if (!user) return null;
    return (
      <div style={{ minHeight: "100vh", background: "#fafafa", padding: "20px 16px", maxWidth: 600, margin: "0 auto" }}>
        <style>{``}</style>
        <ProfileView user={user} entries={entries} onBack={() => setViewProfile(null)}
          savedTrips={savedTrips}
          onAddToTrip={(tripId, entry) => setSavedTrips(prev => prev.map(t => {
            if (t.id !== tripId) return t;
            const updatedDays = t.plan?.days ? [...t.plan.days] : [];
            if (updatedDays.length === 0) updatedDays.push({ day: 1, city: t.destination, entries: [], activity: "" });
            updatedDays[0] = { ...updatedDays[0], entries: [...updatedDays[0].entries, entry] };
            return { ...t, plan: { ...t.plan, days: updatedDays } };
          }))}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FCFAF8", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#000" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #ede8e2; } ::-webkit-scrollbar-thumb { background: #c5b9af; border-radius: 4px; }
        input:focus, textarea:focus { border-color: #3d1f14 !important; outline: none; }
        button { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        button:active { opacity: 0.75; transform: scale(0.97); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .home-photo-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ede8e2", padding: "12px 20px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 10px rgba(61,31,20,0.06)" }}>
        <div className="ts-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="ts-brand-name" style={{ fontFamily: "'Lora', 'Georgia', serif", color: "#1a0a00", fontSize: 20, fontWeight: 700, letterSpacing: "0.01em", lineHeight: 1 }}>Travel Slate</div>
            <div className="ts-brand-sub" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 9, color: "#b09e94", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 3 }}>Your Food &amp; Travel Diary</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="ts-log-header" onClick={() => setShowAddModal(true)}
              style={{ background: "#7B2D42", border: "none", borderRadius: 10, padding: "9px 18px",
                color: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSize: 13, cursor: "pointer", fontWeight: 600, letterSpacing: "0.01em" }}>
              + Log
            </button>
            {/* Avatar menu */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowAvatarMenu(v => !v)}
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
                title={currentUser.name}
              >
                <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", background: "#ede8e2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: "2px solid #d8cfc7", position: "relative" }}>
                  {currentUser.avatarImg
                    ? <img src={currentUser.avatarImg} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : currentUser.avatar}
                  {unreadNotifCount > 0 && (
                    <span style={{ position: "absolute", top: 1, right: 1, width: 8, height: 8, background: "#e53935", borderRadius: "50%", border: "1.5px solid #fff" }} />
                  )}
                </div>
              </button>
              {showAvatarMenu && (
                <>
                  <div onClick={() => setShowAvatarMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 99 }} />
                  <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", border: "1px solid #ede8e2", borderRadius: 12, boxShadow: "0 4px 20px rgba(61,31,20,0.12)", minWidth: 180, zIndex: 100, overflow: "hidden" }}>
                    <div style={{ padding: "10px 14px", borderBottom: "1px solid #f5f0eb" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1a0a00" }}>{currentUser.name}</div>
                      <div style={{ fontSize: 11, color: "#b09e94" }}>@{currentUser.username}</div>
                    </div>
                    <button onClick={() => { setShowAvatarMenu(false); setShowNotifications(v => !v); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "none", border: "none", padding: "11px 14px", cursor: "pointer", fontSize: 13, color: "#3d1f14", fontFamily: "inherit", textAlign: "left" }}>
                      <span style={{ position: "relative", fontSize: 16 }}>
                        🔔
                        {unreadNotifCount > 0 && <span style={{ position: "absolute", top: -2, right: -3, width: 7, height: 7, background: "#e53935", borderRadius: "50%", border: "1px solid #fff" }} />}
                      </span>
                      Notifications
                      {unreadNotifCount > 0 && <span style={{ marginLeft: "auto", fontSize: 11, background: "#e53935", color: "#fff", borderRadius: 10, padding: "1px 6px" }}>{unreadNotifCount}</span>}
                    </button>
                    <button onClick={() => { setShowAvatarMenu(false); setShowNetwork(true); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "none", border: "none", padding: "11px 14px", cursor: "pointer", fontSize: 13, color: "#3d1f14", fontFamily: "inherit", textAlign: "left" }}>
                      <span style={{ fontSize: 16 }}>👥</span>
                      Friends & Network
                    </button>
                    <div style={{ borderTop: "1px solid #f5f0eb" }}>
                      <button onClick={onLogout}
                        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", background: "none", border: "none", padding: "11px 14px", cursor: "pointer", fontSize: 13, color: "#9e3030", fontFamily: "inherit", textAlign: "left" }}>
                        <span style={{ fontSize: 16 }}>🚪</span>
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAllRead={() => setReadNotifIds(new Set(notifications.map(n => n.id)))}
          onGoToTrip={(tripId, section) => { setFocusTripSection({ tripId, section }); setTab("trips"); }}
        />
      )}

      {/* Nav */}
      <div style={{ borderBottom: "1px solid #ede8e2", background: "#fff", position: "sticky", top: 57, zIndex: 40 }}>
        <div style={{ display: "flex", width: "100%" }}>
          {[["home","Home"],["explore","Explore"],["trips","Trips"],["mine","My Logs"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className="ts-tab"
              style={{ border: "none", borderBottom: tab === id ? "2.5px solid #3d1f14" : "2.5px solid transparent",
                background: "transparent",
                color: "#1a0a00", cursor: "pointer",
                fontWeight: tab === id ? 700 : 400,
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                transition: "all 0.18s", letterSpacing: "0.02em" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="ts-content">

        {/* HOME TAB */}
        {tab === "home" && (
          <HomeTab
            currentUser={currentUser}
            savedTrips={savedTrips}
            entries={entries}
            allUsers={ALL_USERS}
            onGoToTrips={() => setTab("trips")}
            onGoToExplore={() => setTab("explore")}
            onGoToTrip={(tripId, section) => { setFocusTripSection({ tripId, section }); setTab("trips"); }}
            onUpdateCoverPhoto={(tripId, photo) => setSavedTrips(prev => prev.map(t => t.id === tripId ? { ...t, coverPhoto: photo } : t))}
            onViewProfile={setViewProfile}
          />
        )}

        {/* EXPLORE TAB */}
        {tab === "explore" && (
          <ExploreTab
            entries={entries}
            savedTrips={savedTrips}
            savedBookmarks={savedBookmarks}
            onToggleBookmark={async id => {
              setSavedBookmarks(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
              const isNowBookmarked = !savedBookmarks.has(id);
              if (isNowBookmarked) await supabase.from("bookmarks").insert({ user_id: user?.id, entry_id: id });
              else await supabase.from("bookmarks").delete().eq("user_id", user?.id).eq("entry_id", id);
            }}
            onAddToTrip={(tripId, entry) => setSavedTrips(prev => prev.map(t => {
              if (t.id !== tripId) return t;
              const updatedDays = t.plan?.days ? [...t.plan.days] : [];
              if (updatedDays.length === 0) updatedDays.push({ day: 1, city: t.destination, entries: [], activity: "" });
              updatedDays[0] = { ...updatedDays[0], entries: [...updatedDays[0].entries, entry] };
              return { ...t, plan: { ...t.plan, days: updatedDays } };
            }))}
            onViewProfile={setViewProfile}
            currentUserId={currentUser.id}
          />
        )}

        {/* MY LOGS TAB */}
        {tab === "mine" && (
          <MyLogsTab
            entries={entries}
            currentUser={currentUser}
            savedTrips={savedTrips}
            setEntries={setEntries}
            setEditingEntry={setEditingEntry}
            showImport={showImport}
            setShowImport={setShowImport}
            onEditProfile={() => setShowEditProfile(true)}
            onGoToTrips={() => setTab("trips")}
            savedBookmarks={savedBookmarks}
            onToggleBookmark={async id => {
              setSavedBookmarks(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
              const isNowBookmarked = !savedBookmarks.has(id);
              if (isNowBookmarked) await supabase.from("bookmarks").insert({ user_id: user?.id, entry_id: id });
              else await supabase.from("bookmarks").delete().eq("user_id", user?.id).eq("entry_id", id);
            }}
          />
        )}

        {/* MY TRIPS TAB */}
        {tab === "trips" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {importToLogsMsg && (
              <div style={{ background: "#000", color: "#fff", borderRadius: 8, padding: "12px 16px",
                fontSize: 13, textAlign: "center" }}>
                {importToLogsMsg}
              </div>
            )}

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div style={{ paddingTop: 4 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#000" }}>My Trips ✈️</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>Plan, track and share your travels</div>
              </div>
              <button onClick={() => setShowTripModal(true)}
                style={{ background: "linear-gradient(135deg, #f0a882, #e87a4a)", border: "none",
                  borderRadius: 50, padding: "10px 20px", color: "#fff", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", flexShrink: 0, marginTop: 4,
                  boxShadow: "0 2px 8px rgba(232,122,74,0.35)" }}>
                + Plan Trip
              </button>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "Active", value: savedTrips.filter(t => !t.completed).length, ref: tripsPlanningRef },
                { label: "Places Planned", value: savedTrips.filter(t => !t.completed).flatMap(t => t.plan?.days?.flatMap(d => d.entries || d.items || []) || []).length, ref: tripsPlanningRef },
                { label: "Past Trips", value: savedTrips.filter(t => t.completed).length, ref: tripsPastRef },
              ].map(s => (
                <div key={s.label} onClick={() => s.ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  style={{ flex: 1, background: "#fff", border: "1px solid #efefef", borderRadius: 14,
                  padding: "16px 12px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  cursor: "pointer" }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: "#000" }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "#888", marginTop: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Planning section */}
            <div ref={tripsPlanningRef}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#000", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                Planning
              </div>
              {savedTrips.filter(t => !t.completed).length === 0 ? (
                <div style={{ background: "#fafafa", border: "1px dashed #e8e8e8", borderRadius: 16, padding: "48px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: 44, marginBottom: 12 }}>✈️</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#555", marginBottom: 4 }}>No trips planned yet</div>
                  <div style={{ fontSize: 13, color: "#aaa" }}>Tap <strong>+ Plan Trip</strong> to start your next adventure</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {savedTrips.filter(t => !t.completed).map(trip => (
                    <TripCard key={trip.id} trip={trip} entries={entries}
                      onDelete={async () => { await supabase.from("trips").delete().eq("id", trip.id); setSavedTrips(prev => prev.filter(t => t.id !== trip.id)); }}
                      onComplete={async coverPhoto => { await supabase.from("trips").update({ completed: true, cover_photo: coverPhoto || null }).eq("id", trip.id); setSavedTrips(prev => prev.map(t => t.id === trip.id ? { ...t, completed: true, ...(coverPhoto ? { coverPhoto } : {}) } : t)); }}
                      onInviteFriend={uid => setSavedTrips(prev => prev.map(t => t.id === trip.id ? {...t, invitedFriends: (t.invitedFriends||[]).includes(uid) ? (t.invitedFriends||[]).filter(x=>x!==uid) : [...(t.invitedFriends||[]), uid]} : t))}
                      onAddPlaces={() => setShowTripModal(true)}
                      onUpdate={async updated => { await saveTripToDb(updated, user?.id); setSavedTrips(prev => prev.map(t => t.id === updated.id ? updated : t)); }}
                      onEdit={() => setEditingTrip(trip)}
                      focusSection={focusTripSection?.tripId === trip.id ? focusTripSection.section : null}
                      onFocusHandled={() => setFocusTripSection(null)}
                      onShare={userId => {
                        const friend = ALL_USERS.find(u => u.id === userId);
                        let wasShared = false;
                        setSavedTrips(prev => prev.map(t => {
                          if (t.id !== trip.id) return t;
                          wasShared = (t.sharedWith || []).includes(userId);
                          return { ...t, sharedWith: wasShared ? (t.sharedWith || []).filter(x => x !== userId) : [...new Set([...(t.sharedWith || []), userId])] };
                        }));
                        if (!wasShared) {
                          setSharedTrips(prev => {
                            const already = prev.find(t => t.id === trip.id && t.sharedBy === "u1");
                            if (already) return prev;
                            return [{ ...trip, sharedBy: "u1", sharedAt: new Date().toLocaleDateString() }, ...prev];
                          });
                          setImportToLogsMsg(`✓ Trip shared with ${friend?.name || "friend"}!`);
                          setTimeout(() => setImportToLogsMsg(""), 3000);
                        }
                      }}
                      onImportToLogs={() => importTripToLogs(trip, setEntries, setImportToLogsMsg)}
                      onImportSingle={entry => setPrefillEntry(entry)}
                      friendState={friendState}
                      allUsers={ALL_USERS}
                      onViewProfile={setViewProfile}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Friends shared trips */}
            {sharedTrips.filter(t => t.sharedBy !== "u1").length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#000", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                  Shared With You
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {sharedTrips.filter(t => t.sharedBy !== "u1").map(trip => {
                    const sharer = ALL_USERS.find(u => u.id === trip.sharedBy);
                    return (
                      <SharedTripCard key={trip.id} trip={trip} sharer={sharer}
                        onImportToLogs={entry => setPrefillEntry(entry)}
                        onViewProfile={setViewProfile}
                        savedTrips={savedTrips}
                        onAddToTrip={(tripId, entry) => setSavedTrips(prev => prev.map(t => {
                          if (t.id !== tripId) return t;
                          const updatedDays = t.plan?.days ? [...t.plan.days] : [];
                          if (updatedDays.length === 0) updatedDays.push({ day: 1, city: t.destination, entries: [], activity: "" });
                          updatedDays[0] = { ...updatedDays[0], entries: [...(updatedDays[0].entries || []), entry] };
                          return { ...t, plan: { ...t.plan, days: updatedDays } };
                        }))}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past section */}
            {savedTrips.filter(t => t.completed).length > 0 && (
              <div ref={tripsPastRef}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#000", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                  Past Trips
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {savedTrips.filter(t => t.completed).map(trip => (
                    <TripCard key={trip.id} trip={trip} entries={entries}
                      onDelete={async () => { await supabase.from("trips").delete().eq("id", trip.id); setSavedTrips(prev => prev.filter(t => t.id !== trip.id)); }}
                      past
                      onReactivate={async () => { await supabase.from("trips").update({ completed: false }).eq("id", trip.id); setSavedTrips(prev => prev.map(t => t.id === trip.id ? {...t, completed: false} : t)); }}
                      onImportToLogs={() => importTripToLogs(trip, setEntries, setImportToLogsMsg)}
                      onImportSingle={entry => setPrefillEntry(entry)}
                      onShare={userId => {
                        const friend = ALL_USERS.find(u => u.id === userId);
                        let wasShared = false;
                        setSavedTrips(prev => prev.map(t => {
                          if (t.id !== trip.id) return t;
                          wasShared = (t.sharedWith || []).includes(userId);
                          return { ...t, sharedWith: wasShared ? (t.sharedWith || []).filter(x => x !== userId) : [...new Set([...(t.sharedWith || []), userId])] };
                        }));
                        if (!wasShared) {
                          setSharedTrips(prev => {
                            const already = prev.find(t => t.id === trip.id && t.sharedBy === "u1");
                            if (already) return prev;
                            return [{ ...trip, sharedBy: "u1", sharedAt: new Date().toLocaleDateString() }, ...prev];
                          });
                          setImportToLogsMsg(`✓ Trip shared with ${friend?.name || "friend"}!`);
                          setTimeout(() => setImportToLogsMsg(""), 3000);
                        }
                      }}
                      friendState={friendState}
                      allUsers={ALL_USERS}
                      onViewProfile={setViewProfile}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showEditProfile && <EditProfileModal user={currentUser} onClose={() => setShowEditProfile(false)} onSave={updated => { setCurrentUser(updated); setShowEditProfile(false); }} />}
      {showAddModal && <AddEntryModal key="add-entry-modal" onClose={() => setShowAddModal(false)} onSave={async e => {
        const { data, error } = await supabase.from("entries").insert(localEntryToDb(e, user?.id)).select().single();
        if (!error && data) setEntries(prev => [dbEntryToLocal(data), ...prev]);
        else setEntries(prev => [e, ...prev]); // fallback: show locally even if DB write fails
        setShowAddModal(false);
      }} entries={entries} />}
      {prefillEntry && <AddEntryModal key={prefillEntry.id || "prefill"} prefill={prefillEntry} onClose={() => setPrefillEntry(null)} onSave={async e => {
        const { data, error } = await supabase.from("entries").insert(localEntryToDb(e, user?.id)).select().single();
        if (!error && data) setEntries(prev => [dbEntryToLocal(data), ...prev]);
        else setEntries(prev => [e, ...prev]);
        setPrefillEntry(null);
      }} entries={entries} />}
      {editingEntry && <EditEntryModal entry={editingEntry} onClose={() => setEditingEntry(null)} onSave={async updated => {
        const { data, error } = await supabase.from("entries").update(localEntryToDb(updated, user?.id)).eq("id", updated.id).select().single();
        if (!error && data) setEntries(prev => prev.map(e => e.id === updated.id ? dbEntryToLocal(data) : e));
        else setEntries(prev => prev.map(e => e.id === updated.id ? updated : e));
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
                currentUser={currentUser}
                friendProfiles={friendProfiles}
              />
            </div>
          </div>
        </div>
      )}
      {(showTripModal || editingTrip) && <TripPlannerModal entries={entries}
        onClose={() => { setShowTripModal(false); setEditingTrip(null); }}
        savedTrips={savedTrips}
        editTrip={editingTrip || null}
        onSaveTrip={async trip => {
          const dbId = await saveTripToDb(trip, user?.id);
          setSavedTrips(prev => [dbId ? { ...trip, id: dbId } : trip, ...prev]);
        }}
        onUpdateTrip={async updated => {
          await saveTripToDb(updated, user?.id);
          setSavedTrips(prev => prev.map(t => t.id === updated.id ? updated : t));
          setEditingTrip(null);
        }} />}

      {/* Floating Log button — mobile only */}
      <button className="ts-fab" onClick={() => setShowAddModal(true)}>
        ＋ Log
      </button>

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

  const handleSubmit = async () => {
    setError("");
    if (mode === "signup") {
      if (!form.email || !form.password || !form.name) { setError("Please fill in all fields."); return; }
      if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    } else {
      if (!form.email || !form.password) { setError("Please enter your email and password."); return; }
    }
    setLoading(true);
    if (mode === "signup") {
      const username = form.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "_");
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { name: form.name.trim(), username } }
      });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data.session) {
        onAuth(data.session.user);
      } else {
        setError("Check your email to confirm your account, then sign in.");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) { setError(error.message); setLoading(false); return; }
      onAuth(data.session.user);
    }
    setLoading(false);
  };

  const inp = (field, label, placeholder, type = "text") => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ color: "#666", fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</label>
      <input type={type} value={form[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        placeholder={placeholder}
        style={{ width: "100%", background: "#f8f8f8", border: "1px solid #efefef", borderRadius: 10,
          padding: "11px 12px", color: "#000", fontSize: 14,
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
          style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16, fontWeight: 500, padding: "4px 0", marginBottom: 24 }}>
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
                color: mode === id ? "#fff" : "#555",
                fontSize: 13, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: mode === id ? 700 : 400,
                transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Google Sign-in */}
        <button onClick={async () => { setLoading(true); const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } }); if (error) { setError(error.message); setLoading(false); } }}
          style={{ width: "100%", background: "#fff", border: "1px solid #dbdbdb", borderRadius: 10, padding: "11px 16px",
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
          <div style={{ background: "#fff0f0", border: "1px solid #ffd0d0", borderRadius: 10, padding: "10px 14px",
            color: "#cc0000", fontSize: 13, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", marginBottom: 16 }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", background: loading ? "#555" : "#000",
            border: "none", borderRadius: 10, padding: "14px", color: "#fff",
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
export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [screen, setScreen] = useState("landing");
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    // Restore existing session on page load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setAuthUser(session.user); setScreen("app"); }
      setSessionLoading(false);
    });
    // Listen for login/logout events (e.g. OAuth redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setAuthUser(session.user); setScreen("app"); }
      else { setAuthUser(null); setScreen("landing"); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setScreen("landing");
  };

  if (sessionLoading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa", fontSize: 28 }}>✈️</div>;
  }

  if (authUser && screen === "app") {
    return <MainApp user={authUser} onLogout={handleLogout} />;
  }

  if (screen === "auth-signup" || screen === "auth-login") {
    return (
      <AuthScreen
        mode={screen === "auth-signup" ? "signup" : "login"}
        onAuth={(user) => { setAuthUser(user); setScreen("app"); }}
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