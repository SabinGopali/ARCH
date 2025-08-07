import seedCategories from "../utils/seedCategories.js";

// Run the category seeding
console.log("🚀 Setting up the application...");
console.log("📦 Seeding categories...");

seedCategories()
  .then(() => {
    console.log("✅ Setup completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });