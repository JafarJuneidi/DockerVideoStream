import { useState, useEffect } from "react";

function App() {
    return (
        <MP4Table />
    );
}

type File = {
    id: string,
    name: string,
    created_at: string
}

function MP4Table() {
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3001/getFiles');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log(result);
                setFiles(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId);
    }, []);

    if (files == null) {
        return <div>No Data</div>
    }

    return (
        <div className="flex h-screen">
            <div className="m-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-3 border-b border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                Id
                            </th>
                            <th className="py-2 px-3 border-b border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                MP4 Files
                            </th>
                            <th className="py-2 px-3 border-b border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-600 uppercase tracking-wider">
                                Created At
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {files.map((file, index) => (
                            <tr key={index}>
                                <td className="py-2 px-3 border-b border-gray-200">
                                    {file.id}
                                </td>
                                <td className="py-2 px-3 border-b border-gray-200">
                                    <FileItem fileName={file.name} />
                                </td>
                                <td className="py-2 px-3 border-b border-gray-200">
                                    {file.created_at}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

import Modal from 'react-modal';

Modal.setAppElement('#root');

const FileItem = ({ fileName }: { fileName: string }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <>
            <div
                onClick={() => setModalIsOpen(true)}
                className="cursor-pointer hover:text-blue-500"
            >
                {fileName}
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Video Modal"
                overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                className="bg-white p-4 rounded-lg shadow-xl relative max-w-3xl mx-4 w-full outline-none"
            >
                <video width="100%" controls className="w-full">
                    <source src={`http://localhost:3000/stream/${fileName}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setModalIsOpen(false)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-400"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default App;
