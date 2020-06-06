import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import "./styles.css";

interface props {
  onFileUploaded: (file: File) => void;
}

const DropZone: React.FC<props> = ({ onFileUploaded }) => {
  const [urlArquivoSelec, setUrlArquivoSelec] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const arquivo = acceptedFiles[0];
    const urlArquivo = URL.createObjectURL(arquivo);

    setUrlArquivoSelec(urlArquivo);
    onFileUploaded(arquivo);
  }, [onFileUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  }); // configurar aqui so aceitar * tipo de arquivo, para barrar o usuario de forcar outro tipo

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {urlArquivoSelec ? (
        <img src={urlArquivoSelec} alt="Imagem do local"></img>
      ) : isDragActive ? (
        <p>Solte aqui</p>
      ) : (
        <p>
          <FiUpload />
          Arraste aqui a imagem do novo ponto de coleta
          <br />
          ou clique para selecionar
        </p>
      )}{" "}
      {/*condicional de renderizacao */}
    </div>
  );
};

export default DropZone;
/*
input atributos:
mult - aceitar mais de um arquivo
*/
