import { useEffect, useState} from "react";
import { getMatches } from "./server";
import { TimePicker } from "antd";
import dayjs from "dayjs";

function Home() {
    const [data, setData] = useState(null);
    const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

    useEffect(() => {
        fetch('localfile/matches.json')
            .then(res => res.json())
            .then(data => setData(data));
        getMatches().then(data => console.log(data));
    }, []);

    
    
    const handleTimeChange = (time) => {
        if (data) {
            const newStartTime = time.format("HH:mm");
            const updatedSessions = [...data.場次];
            updatedSessions[currentSessionIndex].開始時間 = newStartTime;

            setData({ ...data, 場次: updatedSessions });

            // 這裡可以將更新的數據發送到伺服器或生成文件
            // saveToFile(updatedSessions);
        }
    };

    const saveToFile = (updatedSessions) => {
        const updatedData = { 場次: updatedSessions };
        const jsonString = JSON.stringify(updatedData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'matches.json'; // 設定下載文件的名稱
        document.body.appendChild(a);
        a.click(); // 觸發下載
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // 釋放 Blob URL
    };

    if (!data) {
        return <p>Loading...</p>;
    }

    const currentSession = data.場次[currentSessionIndex];

    return (
        <div>
            <TimePicker
                format={"HH:mm"}
                defaultValue={dayjs(currentSession.開始時間, "HH:mm")}
                onChange={handleTimeChange}
            />
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

export default Home;