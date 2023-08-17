import { useState, useEffect, useLayoutEffect } from "react";
import Modal from 'react-modal';
import { Link, Redirect, Route, Switch, useLocation, useRoute } from "wouter";
import { AuthProvider, useAuth } from "./AuthContext";
import { response } from "express";
import axios from "axios";
import { setMaxParserCache } from "mysql2";

function App() {
    return (
        <AuthProvider>
            <Switch>
                <Route path="/login">{() => <Login />}</Route>
                <Route path="/register">{() => <Register />}</Route>
                <Route path="/">{() => <MP4Table />}</Route>
            </Switch>
        </AuthProvider >
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

function Register() {
    const { setAuthToken } = useAuth();
    const [, navigate] = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // const response = await axios.post('http://containerization-authentication-service-1:8080/api/v1/auth/register', {firstname, lastname, email, password});
            const response = await axios.post('http://localhost:8080/api/v1/auth/register', {firstname, lastname, email, password});
            setAuthToken(response.data.token);
            navigate("/");
        } catch (err) {
            setError('An error occurred');
        }
        setLoading(false);
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-200">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl mb-4">Register</h2>
                <input
                    className="border mb-4 p-2 w-full"
                    type="text"
                    placeholder="First Name"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                />
                <input
                    className="border mb-4 p-2 w-full"
                    type="text"
                    placeholder="Last Name"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                />
                <input
                    className="border mb-4 p-2 w-full"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="border mb-4 p-2 w-full"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className={`bg-blue-500 text-white p-2 w-full mb-4 rounded ${loading ? 'opacity-50' : ''}`}
                    disabled={loading}
                    onClick={handleSubmit}
                >
                    {loading ? 'Loading...' : 'Register'}
                </button>
                {error && <p className="text-red-500">{error}</p>}
                <Link to="/login">Already have an account? Login</Link>
            </div>
        </div>
    );
}

function Login() {
    const { setAuthToken } = useAuth();
    const [, navigate] = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // const response = await axios.post('http://containerization-authentication-service-1:8080/api/v1/auth/authenticate', {email, password});
            const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', {email, password});
            setAuthToken(response.data.token);
            navigate("/");
        } catch (err) {
            setError('An error occurred');
        }
        setLoading(false);
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-200">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl mb-4">Login</h2>
                <input
                    className="border mb-4 p-2 w-full"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="border mb-4 p-2 w-full"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className={`bg-blue-500 text-white p-2 w-full mb-4 rounded ${loading ? 'opacity-50' : ''}`}
                    disabled={loading}
                    onClick={handleSubmit}
                >
                    {loading ? 'Loading...' : 'Login'}
                </button>
                {error && <p className="text-red-500">{error}</p>}
                <Link to="/register">Don't have an account? Register</Link>
            </div>
        </div>
    );
}

export default App;
