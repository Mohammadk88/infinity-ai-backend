import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🚀 Starting seed...');

    // 🧠 Categories
    await prisma.category.createMany({
      data: [
        { name: 'Technology' },
        { name: 'Marketing' },
        { name: 'Lifestyle' },
        { name: 'Business' },
      ],
      skipDuplicates: true,
    });

    // 🏷️ Tags
    await prisma.tag.createMany({
      data: [
        { name: 'AI' },
        { name: 'Startup' },
        { name: 'Tips' },
        { name: 'Growth' },
      ],
      skipDuplicates: true,
    });

    // 📦 Subscription Plans
    await prisma.subscriptionPlan.createMany({
      data: [
        {
          name: 'Free',
          priceMonthly: 0,
          priceYearly: 0,
          duration: 30,
          features: ['Basic Posting', 'AI Limited'],
          isRecommended: false,
        },
        {
          name: 'Pro',
          priceMonthly: 29,
          priceYearly: 290,
          duration: 30,
          features: ['Unlimited Posts', 'Full AI', 'Analytics'],
          isRecommended: true,
        },
        {
          name: 'Agency',
          priceMonthly: 99,
          priceYearly: 990,
          duration: 30,
          features: ['Team Support', 'Multi-Clients', 'Priority Support'],
          isRecommended: false,
        },
      ],
      skipDuplicates: true,
    });

    console.log('✅ Seed completed successfully!');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('❌ Error in main:', e);
  process.exit(1);
});
