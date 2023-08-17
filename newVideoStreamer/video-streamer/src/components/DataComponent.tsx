import { useState, useEffect } from 'react';

interface DataType {
    [key: string]: any;
}

function DataComponent() {
    const [data, setData] = useState<DataType | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('YOUR_API_ENDPOINT_HERE');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result: DataType = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <h1>Data from API:</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

export default DataComponent;
