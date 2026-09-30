require('dotenv').config();
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

// Verify environment variables
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error("❌ Cloudinary configuration missing in backend/.env!");
  console.error("Please add the following to backend/.env:");
  console.error("CLOUDINARY_CLOUD_NAME=your_cloud_name");
  console.error("CLOUDINARY_API_KEY=your_api_key");
  console.error("CLOUDINARY_API_SECRET=your_api_secret");
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const PUBLIC_DIR = path.resolve(__dirname, '../frontend/public');

// Supported file extensions
const IMAGE_EXTENSIONS = new Set(['.webp', '.png', '.jpg', '.jpeg', '.svg', '.pdf']);

/**
 * Recursively find all image files in a directory
 */
function findImages(dir, relativeDir = '') {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      results = results.concat(findImages(fullPath, relPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        results.push({
          fullPath,
          relativeUrl: `/${relPath.replace(/\\/g, '/')}`,
          relativeDir: relativeDir.replace(/\\/g, '/'),
          filename: path.parse(entry.name).name,
          extension: ext,
        });
      }
    }
  }

  return results;
}

async function uploadImage(image) {
  // Folder inside Cloudinary: conbell/<subfolder>
  const folder = image.relativeDir
    ? `conbell/${image.relativeDir}`
    : 'conbell';

  const publicId = image.filename;

  try {
    const result = await cloudinary.uploader.upload(image.fullPath, {
      folder: folder,
      public_id: publicId,
      overwrite: true,
      resource_type: 'auto',
    });

    console.log(`✅ Uploaded: ${image.relativeUrl} -> ${result.secure_url}`);
    return {
      localPath: image.relativeUrl,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(`❌ Failed: ${image.relativeUrl} - ${error.message}`);
    return {
      localPath: image.relativeUrl,
      error: error.message,
    };
  }
}

async function updateDatabase(urlMap) {
  if (!process.env.MONGODB_URI) {
    console.log("ℹ️ MONGODB_URI not set, skipping database update.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("\n📦 Connected to MongoDB, updating image URLs...");

    const Hero = require('./models/Hero');
    const Product = require('./models/Product');
    const Service = require('./models/Service');

    // 1. Update Hero slides
    const heroes = await Hero.find();
    let heroCount = 0;
    for (const hero of heroes) {
      let modified = false;
      if (hero.imageDesktop && urlMap[hero.imageDesktop]) {
        hero.imageDesktop = urlMap[hero.imageDesktop];
        modified = true;
      }
      if (hero.imageMobile && urlMap[hero.imageMobile]) {
        hero.imageMobile = urlMap[hero.imageMobile];
        modified = true;
      }
      if (modified) {
        await hero.save();
        heroCount++;
      }
    }
    console.log(`   Updated ${heroCount} Hero slides`);

    // 2. Update Products
    const products = await Product.find();
    let productCount = 0;
    for (const prod of products) {
      let modified = false;
      if (prod.image && urlMap[prod.image]) {
        prod.image = urlMap[prod.image];
        modified = true;
      }
      if (Array.isArray(prod.gallery) && prod.gallery.length > 0) {
        const newGallery = prod.gallery.map(g => urlMap[g] || g);
        if (JSON.stringify(newGallery) !== JSON.stringify(prod.gallery)) {
          prod.gallery = newGallery;
          modified = true;
        }
      }
      if (modified) {
        await prod.save();
        productCount++;
      }
    }
    console.log(`   Updated ${productCount} Products`);

    // 3. Update Services
    const services = await Service.find();
    let serviceCount = 0;
    for (const serv of services) {
      if (serv.image && urlMap[serv.image]) {
        serv.image = urlMap[serv.image];
        await serv.save();
        serviceCount++;
      }
    }
    console.log(`   Updated ${serviceCount} Services`);

    console.log("🎉 Database image URLs updated successfully!");
  } catch (error) {
    console.error("⚠️ Failed to update database:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

async function main() {
  console.log("==========================================");
  console.log("   CONBELL ENGINEERING - CLOUDINARY SEED  ");
  console.log("==========================================\n");
  console.log(`Target Cloudinary Folder: conbell`);
  console.log(`Source Folder: ${PUBLIC_DIR}\n`);

  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`❌ Public directory not found: ${PUBLIC_DIR}`);
    process.exit(1);
  }

  const images = findImages(PUBLIC_DIR);
  console.log(`Found ${images.length} images to upload.\n`);

  const results = [];
  const urlMap = {};

  // Upload in chunks of 3 to avoid rate limits
  const CHUNK_SIZE = 3;
  for (let i = 0; i < images.length; i += CHUNK_SIZE) {
    const chunk = images.slice(i, i + CHUNK_SIZE);
    const chunkResults = await Promise.all(chunk.map(img => uploadImage(img)));
    results.push(...chunkResults);
    
    for (const r of chunkResults) {
      if (r.cloudinaryUrl) {
        urlMap[r.localPath] = r.cloudinaryUrl;
      }
    }
  }

  // Save mapping to file
  const mapPath = path.resolve(__dirname, 'cloudinary-urls.json');
  fs.writeFileSync(mapPath, JSON.stringify(urlMap, null, 2));
  console.log(`\n💾 Saved URL mapping to: ${mapPath}`);

  const successCount = Object.keys(urlMap).length;
  console.log(`\n📊 Upload Summary: ${successCount}/${images.length} succeeded.`);

  // Update DB if any uploads succeeded
  if (successCount > 0) {
    await updateDatabase(urlMap);
  }

  console.log("\n✨ Done!");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
