import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";

import "./style.css";
import logo from "../../assets/logo.svg";

import axios from "axios";
import api from "../../services/api";
import DropZone from "../../components/dropZone";

interface itemInterface {
  idItem: number;
  nome: string;
  imageUrl: string;
}
interface ufInterface {
  sigla: string;
}
interface cidadeInterface {
  nome: string;
}

const CriarPonto = () => {
  const history = useHistory();

  // ao criar estado para um array ou objeto, é necessario informar o tipo manualmente
  const [itensColeta, setItensColeta] = useState<itemInterface[]>([]);
  const [posicaoInicial, setPosicaoInicial] = useState<[number, number]>([
    0,
    0,
  ]);
  const [posicaoSelecionada, setPosicaoSelecionada] = useState<
    [number, number]
  >([0, 0]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [ufSelecionado, setUfSelecionado] = useState("0");
  const [cidades, setCidades] = useState<string[]>([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState("0");
  const [dadosForm, setDadosForm] = useState({ nome: "", email: "", wpp: "" });
  const [itensSelecionados, setItensSelecionados] = useState<number[]>([]);
  const [arquivoSelec, setArquivoSelec] = useState<File>();

  useEffect(() => {
    api.get("itens").then((res) => {
      setItensColeta(res.data);
    });
  }, [itensColeta]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setPosicaoInicial([latitude, longitude]);
    });
  }, []);
  useEffect(() => {
    // get UFs
    axios
      .get<ufInterface[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((res) => {
        const ufSigla = res.data.map((uf) => uf.sigla);
        setUfs(ufSigla);
      });
  }, []);
  useEffect(() => {
    //get cidades by UF
    if (ufSelecionado === "0") {
      return;
    }
    axios
      .get<cidadeInterface[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelecionado}/municipios`
      )
      .then((res) => {
        const cidadesNomes = res.data.map((cidade) => cidade.nome);
        setCidades(cidadesNomes);
      });
  }, [ufSelecionado]);

  const handleMapClick = (event: LeafletMouseEvent) => {
    setPosicaoSelecionada([event.latlng.lat, event.latlng.lng]);
  };
  const handleUfSelecionado = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUfSelecionado(event.target.value);
  };
  const handleCidadeSelecionado = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCidadeSelecionada(event.target.value);
    //atualiza cidades de acordo co UF
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setDadosForm({ ...dadosForm, [name]: value });
  };
  const handleItemSelecionado = (itemId: number) => {
    const jaSelecionado = itensSelecionados.findIndex(
      (item) => item === itemId
    );
    if (jaSelecionado >= 0) {
      const itensFiltrados = itensSelecionados.filter(
        (item) => item !== itemId
      );
      setItensSelecionados(itensFiltrados);
      return;
    } else {
      setItensSelecionados([...itensSelecionados, itemId]);
    }
  };
  const handleCadastrar = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log(arquivoSelec);

    const { nome, email, wpp } = dadosForm;
    const uf = ufSelecionado;
    const cidade = cidadeSelecionada;
    const [latitude, longitude] = posicaoInicial;
    const itens = itensSelecionados;

    const data = new FormData();

    data.append("nome", nome);
    data.append("email", email);
    data.append("whatsapp", wpp);
    data.append("uf", uf);
    data.append("cidade", cidade);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("itens", itens.join(","));
    if (arquivoSelec) {
      data.append("Imagem", arquivoSelec);
    }

    const resposta = await api.post("Locais", data);
    alert(resposta.status + resposta.statusText);
    history.push("/");
  };

  return (
    <div id="page-cadastrar-ponto">
      <header>
        <img src={logo} alt="ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para Home
        </Link>
      </header>
      <form onSubmit={handleCadastrar}>
        <h1>
          Cadastro do <br /> Ponto de Coleta
        </h1>

        <DropZone onFileUploaded={setArquivoSelec} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="nome">Nome da entidade</label>
            <input
              type="text"
              name="nome"
              id="nome"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="wpp">Whatsapp</label>
              <input
                type="text"
                name="wpp"
                id="wpp"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="nome">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={posicaoInicial} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={posicaoSelecionada}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (Uf)</label>
              <select onChange={handleUfSelecionado} name="uf" id="uf">
                <option value={ufSelecionado}>Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="cidade">Cidade</label>
              <select
                onChange={handleCidadeSelecionado}
                name="cidade"
                id="cidade"
              >
                <option value={cidadeSelecionada}>Selecione uma cidade</option>
                {cidades.map((cidade) => (
                  <option value={cidade}>{cidade}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Itens de coleta </h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">
            {itensColeta.map((item) => (
              <li
                key={item.idItem}
                onClick={() => {
                  handleItemSelecionado(item.idItem);
                }}
                className={
                  itensSelecionados.includes(item.idItem) ? "selected" : ""
                }
              >
                <img src={item.imageUrl} alt={item.nome} />
                <span>{item.nome}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CriarPonto;

//https://twitter.com/TittiesTL/status/1268628414425993216
