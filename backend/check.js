const fs = require('fs').promises;

async function readData() {
  const A = JSON.parse(await fs.readFile('matches.json', 'utf-8'));
  const B = JSON.parse(await fs.readFile('reserved.json', 'utf-8'));
  return { A, B };
}

async function getMatchDetails(date, period) {
    const { A, B } = await readData();
    const match = A.find(item => item.date === date && item.period === period);
    // console.log(match);
    if (match) {
        const participants = B[match.id] || [];
        const totalParticipants = match.total_people;
        console.log(participants);

        // 輸出結果
        console.log(`場次ID: ${match.id}`);
        participants.forEach(participant => {
        console.log(`報名者: ${participant.name}, 電話: ${participant.phone}`);
        console.log(`男生: ${participant.maleNames}`);
        console.log(`女生: ${participant.femaleNames}\n`);
        });
        console.log(`總人數: ${totalParticipants}`);
    } else {
        console.log('未找到符合條件的場次');
    }
    }

// 使用範例
getMatchDetails("11/17 日", "18:00~22:00");
  