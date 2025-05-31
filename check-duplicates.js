const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDuplicates() {
  try {
    console.log('Checking for duplicate social accounts...');
    
    const accounts = await prisma.socialAccount.findMany({
      where: {
        platform: 'FACEBOOK'
      },
      select: {
        id: true,
        userId: true,
        platform: true,
        pageId: true,
        accountName: true
      }
    });
    
    console.log(`Found ${accounts.length} Facebook accounts:`);
    accounts.forEach(acc => {
      console.log(`- User: ${acc.userId}, Page: ${acc.pageId}, Name: ${acc.accountName}`);
    });
    
    // Check for duplicates based on userId + platform + pageId
    const duplicates = accounts.reduce((acc, current) => {
      const key = `${current.userId}:${current.platform}:${current.pageId}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(current);
      return acc;
    }, {});
    
    const hasDuplicates = Object.values(duplicates).some(group => group.length > 1);
    
    if (hasDuplicates) {
      console.log('\n❌ Found duplicates:');
      Object.entries(duplicates).forEach(([key, group]) => {
        if (group.length > 1) {
          console.log(`Key: ${key} has ${group.length} records:`, group.map(g => g.id));
        }
      });
    } else {
      console.log('\n✅ No duplicates found based on userId + platform + pageId');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDuplicates();
