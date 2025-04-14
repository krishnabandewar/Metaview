import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ethers } from 'ethers';
import VideoReward from '../contracts/VideoReward.json';
import contractAddresses from '../contracts/contractAddresses';

const Upload = () => {
    const { isDarkMode } = useTheme();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const fileInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);

    const categories = [
        'Education',
        'Entertainment',
        'Gaming',
        'Technology',
        'Music',
        'Sports',
        'News',
        'Other'
    ];

    const handleVideoSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            setError('');
        } else {
            setError('Please select a valid video file');
        }
    };

    const handleThumbnailSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setThumbnail(file);
            setError('');
        } else {
            setError('Please select a valid image file');
        }
    };

    const handleUpload = async () => {
        if (!title || !description || !category || !thumbnail || !videoFile) {
            setError('Please fill in all fields and select both video and thumbnail');
            return;
        }

        setIsUploading(true);
        setError('');
        setSuccess('');

        try {
            // Simulate upload progress
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 500);

            // Here you would typically:
            // 1. Upload video to IPFS or similar storage
            // 2. Upload thumbnail to IPFS
            // 3. Call smart contract to register video
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const videoReward = new ethers.Contract(
                contractAddresses.videoReward,
                VideoReward.abi,
                signer
            );

            // Mock video hash and thumbnail hash
            const videoHash = 'Qm...';
            const thumbnailHash = 'Qm...';

            const tx = await videoReward.registerVideo(
                title,
                description,
                category,
                videoHash,
                thumbnailHash
            );

            await tx.wait();

            clearInterval(interval);
            setSuccess('Video uploaded successfully!');
            setUploadProgress(0);
            setIsUploading(false);
            // Reset form
            setTitle('');
            setDescription('');
            setCategory('');
            setThumbnail(null);
            setVideoFile(null);
        } catch (err) {
            clearInterval(interval);
            setError(err.message);
            setIsUploading(false);
        }
    };

    return (
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.03)',
                border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e0e0e0'}`
            }}>
                <h1 style={{
                    fontSize: '1.8rem',
                    color: isDarkMode ? '#ffffff' : '#000000',
                    marginBottom: '30px'
                }}>
                    Upload Video
                </h1>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        fontSize: '1rem'
                    }}>
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '6px',
                            border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e0e0e0'}`,
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                            color: isDarkMode ? '#ffffff' : '#000000',
                            fontSize: '1rem'
                        }}
                        placeholder="Enter video title"
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        fontSize: '1rem'
                    }}>
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '6px',
                            border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e0e0e0'}`,
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                            color: isDarkMode ? '#ffffff' : '#000000',
                            fontSize: '1rem',
                            minHeight: '100px',
                            resize: 'vertical'
                        }}
                        placeholder="Enter video description"
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        fontSize: '1rem'
                    }}>
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '6px',
                            border: `1px solid ${isDarkMode ? '#3a3a3a' : '#e0e0e0'}`,
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                            color: isDarkMode ? '#ffffff' : '#000000',
                            fontSize: '1rem'
                        }}
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        fontSize: '1rem'
                    }}>
                        Video File
                    </label>
                    <div
                        onClick={() => fileInputRef.current.click()}
                        style={{
                            border: `2px dashed ${isDarkMode ? '#3a3a3a' : '#e0e0e0'}`,
                            borderRadius: '6px',
                            padding: '30px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#f9f9f9'
                        }}
                    >
                        {videoFile ? (
                            <div style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                                {videoFile.name}
                            </div>
                        ) : (
                            <div style={{ color: isDarkMode ? '#999999' : '#666666' }}>
                                Click to select video file
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleVideoSelect}
                        accept="video/*"
                        style={{ display: 'none' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        color: isDarkMode ? '#ffffff' : '#000000',
                        fontSize: '1rem'
                    }}>
                        Thumbnail
                    </label>
                    <div
                        onClick={() => thumbnailInputRef.current.click()}
                        style={{
                            border: `2px dashed ${isDarkMode ? '#3a3a3a' : '#e0e0e0'}`,
                            borderRadius: '6px',
                            padding: '30px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#f9f9f9'
                        }}
                    >
                        {thumbnail ? (
                            <div style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
                                {thumbnail.name}
                            </div>
                        ) : (
                            <div style={{ color: isDarkMode ? '#999999' : '#666666' }}>
                                Click to select thumbnail image
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={thumbnailInputRef}
                        onChange={handleThumbnailSelect}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </div>

                {isUploading && (
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: isDarkMode ? '#3a3a3a' : '#e0e0e0',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <div
                                style={{
                                    width: `${uploadProgress}%`,
                                    height: '100%',
                                    backgroundColor: '#4CAF50',
                                    transition: 'width 0.3s ease'
                                }}
                            />
                        </div>
                        <div style={{
                            textAlign: 'center',
                            marginTop: '8px',
                            color: isDarkMode ? '#999999' : '#666666'
                        }}>
                            Uploading... {uploadProgress}%
                        </div>
                    </div>
                )}

                {error && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: isDarkMode ? '#ff4444' : '#ffebee',
                        color: isDarkMode ? '#ffffff' : '#c62828',
                        borderRadius: '6px',
                        marginBottom: '20px'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: isDarkMode ? '#4CAF50' : '#e8f5e9',
                        color: isDarkMode ? '#ffffff' : '#2e7d32',
                        borderRadius: '6px',
                        marginBottom: '20px'
                    }}>
                        {success}
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: isUploading
                            ? (isDarkMode ? '#2a2a2a' : '#e0e0e0')
                            : '#4CAF50',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                        opacity: isUploading ? 0.7 : 1
                    }}
                >
                    {isUploading ? 'Uploading...' : 'Upload Video'}
                </button>
            </div>
        </div>
    );
};

export default Upload; 