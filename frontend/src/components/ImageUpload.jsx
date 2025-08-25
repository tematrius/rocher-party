import React, { useState } from 'react';
import { FiUpload, FiTrash2, FiImage } from 'react-icons/fi';
import './ImageUpload.css';

const ImageUpload = ({ currentImage, onImageChange, placeholder = "Ajouter une image" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(currentImage || '');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      return;
    }

    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/upload/menu-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload');
      }

      const data = await response.json();
      
      if (data.success) {
        const imageUrl = `${apiUrl}${data.imageUrl}`;
        console.log('Image uploadée avec succès:', imageUrl);
        setPreviewImage(imageUrl);
        onImageChange(imageUrl);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!previewImage) return;

    // Extraire le nom du fichier de l'URL
    const filename = previewImage.split('/').pop();
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/upload/menu-image/${filename}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPreviewImage('');
        onImageChange('');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression de l\'image');
    }
  };

  return (
    <div className="image-upload">
      <div className="image-upload-container">
        {previewImage ? (
          <div className="image-preview">
            <img 
              src={previewImage} 
              alt="Preview" 
              onError={(e) => {
                console.error('Erreur chargement image:', previewImage);
                e.target.style.display = 'none';
              }}
              onLoad={() => console.log('Image chargée avec succès:', previewImage)}
            />
            <div className="image-overlay">
              <button
                type="button"
                className="remove-image-btn"
                onClick={handleRemoveImage}
                title="Supprimer l'image"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <FiImage className="placeholder-icon" />
            <span>{placeholder}</span>
          </div>
        )}
      </div>

      <div className="upload-controls">
        <label className={`upload-btn ${isUploading ? 'uploading' : ''}`}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          <FiUpload />
          {isUploading ? 'Upload...' : 'Choisir une image'}
        </label>
        
        {previewImage && (
          <button
            type="button"
            className="remove-btn"
            onClick={handleRemoveImage}
            title="Supprimer l'image"
          >
            <FiTrash2 />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
