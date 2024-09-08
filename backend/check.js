const fs = require('fs').promises;

async function readData() {
  const A = JSON.parse(await fs.readFile('matches.json', 'utf-8'));
  const B = JSON.parse(await fs.readFile('reserved.json', 'utf-8'));
  return { A, B };
}

async function getMatchDetails(date, startTime) {
    const { A, B } = await readData();
    const match = A.find(item => item.date === date && item.start_time === startTime);

    if (match) {
        const participants = B[match.id] || [];
        const totalParticipants = match.total_people;

        // 輸出結果
        console.log(`場次ID: ${match.id}`);
        console.log(`報名人員:`);
        participants.forEach(participant => {
        console.log(`姓名: ${participant.name}, 電話: ${participant.phone}`, `報名人數: ${participant.male + participant.female}`);
        });
        console.log(`總人數: ${totalParticipants}`);
    } else {
        console.log('未找到符合條件的場次');
    }
    }

// 使用範例
getMatchDetails("9/10", "18:20");
  