import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ajnfcdbrvqsapfypfuxd.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqbmZjZGJydnFzYXBmeXBmdXhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDI3ODQ2NCwiZXhwIjoyMTA1ODU0NDY0fQ.fFywg8soq2H0NtrqaCtm0NNtm1J8H01jfqE0T3Mr8-g";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Check what condition values are allowed first
const { data: conditionCheck } = await supabase
  .from("listings")
  .select("condition")
  .limit(1);

console.log("Connection test:", conditionCheck !== null ? "OK" : "FAILED");

const listings = [
  {
    id: "b0000001-0000-0000-0000-000000000001",
    athlete_id: "a0000001-0000-0000-0000-000000000001",
    title: "Game-Worn Jersey — Week 12 vs. Dallas",
    description: "The jersey I wore the night I caught the game-winner with 4 seconds left. Blood, sweat, and that impossible catch. Comes with my handwritten note about the play.",
    price: 285.00,
    category: "Jerseys",
    sport: "Football",
    condition: "match_worn",
    status: "active",
    featured: true,
    limited_drop: false,
  },
  {
    id: "b0000001-0000-0000-0000-000000000002",
    athlete_id: "a0000001-0000-0000-0000-000000000001",
    title: "Signed Rookie Card — PSA Graded 9",
    description: "My first rookie card. I signed 50 of these my first season. This one is graded PSA 9. The signature is clean.",
    price: 120.00,
    category: "Cards",
    sport: "Football",
    condition: "signed",
    status: "active",
    featured: false,
    limited_drop: false,
  },
  {
    id: "b0000001-0000-0000-0000-000000000003",
    athlete_id: "a0000001-0000-0000-0000-000000000002",
    title: "Paris 2024 Competition Cap — Race Worn",
    description: "The cap I wore in my 200m freestyle heat in Paris. I qualified for the final in this cap. Never washed. Comes with my race bib.",
    price: 195.00,
    category: "Equipment",
    sport: "Swimming",
    condition: "match_worn",
    status: "active",
    featured: true,
    limited_drop: true,
  },
  {
    id: "b0000001-0000-0000-0000-000000000004",
    athlete_id: "a0000001-0000-0000-0000-000000000002",
    title: "Signed Team USA Photo — Paris 2024",
    description: "Official team photo from the Paris Olympic Village. Signed by me. Framed 8x10.",
    price: 85.00,
    category: "Signed Photos",
    sport: "Swimming",
    condition: "signed",
    status: "active",
    featured: false,
    limited_drop: false,
  },
  {
    id: "b0000001-0000-0000-0000-000000000005",
    athlete_id: "a0000001-0000-0000-0000-000000000003",
    title: "Gold Medal Race Shoes — Paris 2024 Paralympic",
    description: "The exact spikes I wore when I crossed the line first. The world record spikes. I will never forget that moment and I want you to hold a piece of it.",
    price: 450.00,
    category: "Shoes",
    sport: "Track & Field",
    condition: "match_worn",
    status: "active",
    featured: true,
    limited_drop: true,
  },
  {
    id: "b0000001-0000-0000-0000-000000000006",
    athlete_id: "a0000001-0000-0000-0000-000000000004",
    title: "Personal Shoutout and Signed Photo",
    description: "I will record a personal video message for you and sign an 8x10 from Junior Worlds. Tell me who it is for and I will make it special.",
    price: 45.00,
    category: "Signed Photos",
    sport: "Fencing",
    condition: "signed",
    status: "active",
    featured: false,
    limited_drop: false,
  },
  {
    id: "b0000001-0000-0000-0000-000000000007",
    athlete_id: "a0000001-0000-0000-0000-000000000004",
    title: "Junior Worlds Lame — Team USA 2025",
    description: "My competition lame from Junior World Championships in Cairo. The one I won my first international medal in. Size 34 (youth M).",
    price: 165.00,
    category: "Equipment",
    sport: "Fencing",
    condition: "match_worn",
    status: "active",
    featured: false,
    limited_drop: false,
  },
  {
    id: "b0000001-0000-0000-0000-000000000008",
    athlete_id: "a0000001-0000-0000-0000-000000000005",
    title: "Game-Worn Sneakers — EuroLeague Finals",
    description: "The Jordans I wore in the EuroLeague Final in Madrid. Scuffed court marks still on them. Size 13.",
    price: 320.00,
    category: "Shoes",
    sport: "Basketball",
    condition: "match_worn",
    status: "active",
    featured: true,
    limited_drop: false,
  },
  {
    id: "b0000001-0000-0000-0000-000000000009",
    athlete_id: "a0000001-0000-0000-0000-000000000005",
    title: "Signed Jersey — Athens BC #23",
    description: "My Athens jersey from my season in Greece. One of my favorite years. Signed across the number.",
    price: 175.00,
    category: "Jerseys",
    sport: "Basketball",
    condition: "signed",
    status: "active",
    featured: false,
    limited_drop: false,
  },
];

// Try inserting with match_worn first to test
const { error: testError } = await supabase
  .from("listings")
  .insert([listings[0]])
  .select();

if (testError) {
  console.error("Test insert failed:", testError.message);
  // Try alternative condition values
  console.log("Trying 'game_used' instead...");
  listings[0].condition = "game_used";
  const { error: retryError } = await supabase.from("listings").insert([listings[0]]).select();
  if (retryError) {
    console.error("Retry failed:", retryError.message);
    process.exit(1);
  }
  // Update all match_worn to game_used
  for (const l of listings) {
    if (l.condition === "match_worn") l.condition = "game_used";
  }
  console.log("Using game_used for worn items");
}

// Insert remaining listings
const remaining = listings.slice(1);
const { data, error } = await supabase
  .from("listings")
  .upsert(remaining, { onConflict: "id" })
  .select();

if (error) {
  console.error("Insert error:", error.message);
} else {
  console.log(`Inserted ${(data?.length ?? 0) + 1} listings successfully!`);
}
