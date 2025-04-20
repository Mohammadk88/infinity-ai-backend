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
    await prisma.permission.createMany({
      data: [
        { name: 'Create Posts', key: 'can_create_post', module: 'posts' },
        { name: 'Edit Posts', key: 'can_edit_post', module: 'posts' },
        { name: 'View Reports', key: 'can_view_reports', module: 'analytics' },
        {
          name: 'Manage Clients',
          key: 'can_manage_clients',
          module: 'clients',
        },
        { name: 'Assign Tasks', key: 'can_assign_tasks', module: 'tasks' },
      ],
      skipDuplicates: true,
    });

    // 💱 Currencies
    // 🌍 All world currencies (sample, expand as needed)
    const allCurrencies = [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound', symbol: '£' },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
      { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
      { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
      { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
      { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
      { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
      { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
      { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
      { code: 'EGP', name: 'Egyptian Pound', symbol: '£' },
      { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
      { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
      { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
      { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
      { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
      { code: 'SGD', name: 'Singapore Dollar', symbol: '$' },
      // ...add more as needed
    ];
    await prisma.currency.createMany({
      data: allCurrencies,
      skipDuplicates: true,
    });

    // 🌍 All world countries (sample, expand as needed)
    const allCountries = [
      { name: 'United States', code: 'US', currency: 'USD' },
      { name: 'Germany', code: 'DE', currency: 'EUR' },
      { name: 'France', code: 'FR', currency: 'EUR' },
      { name: 'United Kingdom', code: 'GB', currency: 'GBP' },
      { name: 'Japan', code: 'JP', currency: 'JPY' },
      { name: 'Saudi Arabia', code: 'SA', currency: 'SAR' },
      { name: 'Canada', code: 'CA', currency: 'CAD' },
      { name: 'Australia', code: 'AU', currency: 'AUD' },
      { name: 'China', code: 'CN', currency: 'CNY' },
      { name: 'India', code: 'IN', currency: 'INR' },
      { name: 'Russia', code: 'RU', currency: 'RUB' },
      { name: 'Brazil', code: 'BR', currency: 'BRL' },
      { name: 'South Africa', code: 'ZA', currency: 'ZAR' },
      { name: 'Turkey', code: 'TR', currency: 'TRY' },
      { name: 'Egypt', code: 'EG', currency: 'EGP' },
      { name: 'Switzerland', code: 'CH', currency: 'CHF' },
      { name: 'Sweden', code: 'SE', currency: 'SEK' },
      { name: 'Norway', code: 'NO', currency: 'NOK' },
      { name: 'Denmark', code: 'DK', currency: 'DKK' },
      { name: 'South Korea', code: 'KR', currency: 'KRW' },
      { name: 'Singapore', code: 'SG', currency: 'SGD' },
      // ...add more as needed
    ];
    const currencyIdMap = {};
    for (const c of allCurrencies) {
      const currency = await prisma.currency.findUnique({
        where: { code: c.code },
      });
      if (currency) currencyIdMap[c.code] = currency.id;
    }
    await prisma.country.createMany({
      data: allCountries
        .map((c) => ({
          name: c.name,
          code: c.code,
          currencyId: currencyIdMap[c.currency],
        }))
        .filter((c) => c.currencyId),
      skipDuplicates: true,
    });

    // ⚙️ Settings for points and commissions
    await prisma.setting.createMany({
      data: [
        { key: 'points.signup', value: '10', type: 'number', group: 'points' },
        {
          key: 'points.referral',
          value: '10',
          type: 'number',
          group: 'points',
        },
        {
          key: 'points.post_create',
          value: '2',
          type: 'number',
          group: 'points',
        },
        {
          key: 'points.daily_login',
          value: '1',
          type: 'number',
          group: 'points',
        },
        {
          key: 'commission.referral.default',
          value: '10',
          type: 'number',
          group: 'commission',
        },
        {
          key: 'commission.tier1',
          value: '10',
          type: 'number',
          group: 'commission',
        },
        {
          key: 'commission.tier2',
          value: '5',
          type: 'number',
          group: 'commission',
        },
        {
          key: 'commission.tier3',
          value: '2',
          type: 'number',
          group: 'commission',
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
