import {useEffect, useState} from 'react'
import Head from 'next/head'
import axios, {get} from 'axios'
import Modal from 'react-modal'
import { useForm } from "react-hook-form";
import {customStyles, handleError, handleSucess} from '../src/helpers/index'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/Home.module.css';

export default function Home() {

  const [data, setData] = useState([])
  const [undo, setUndo] = useState({})
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenCreate, setIsOpenCreate] = useState(false);
  const [idToEdit, setIdToEdit] = useState(0);

  const { register, handleSubmit, watch, formState: { errors },setValue } = useForm();

  const onEdit = data => handleEdit(data);
  const onCreate = data => handleCreate(data);

  const openEditModal = (id) => {
    setIdToEdit(id)
    setIsOpen(true)
  }

  const hadleRemove = (item) => {
    axios.delete(`http://localhost:3000/products/${item.id}`)
    .then(() => handleSucess('Removido com sucesso!'))
    .catch(err => handleError(err))
    setUndo(item)
  }
  
  const handleEdit = (item) => {
    axios.patch(`http://localhost:3000/products/${idToEdit}`,{...item})
    .then(() => handleSucess('Editado com sucesso!'))
    .catch(err => handleError(err))
    setUndo(item)
    setIsOpen(false)
    setValue('id','')
    setValue('name','')
    setValue('category','')
    setValue('value','')
  }
  
  const handleCreate = (item) => {
    axios.post("http://localhost:3000/products/", {name: item.name, category: item.category, value: item.value})
    .then(() => handleSucess('Criado com sucesso!'))
    .catch(err => handleError(err))
    setUndo(item)
  }

  useEffect(() => {
    get('http://localhost:3000/products').then(
      res => setData(res.data)
    )
  },[undo])


  return (
    <div className={styles.container}>
      <Head>
        <title>Global Hitss - CRUD</title>
        <meta name="description" content="Avaliação - Global Hitss" />
      </Head>
      <h1>Lista de Produtos</h1>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <button type="button" onClick={() => setIsOpenCreate(true)} className={styles.btnNew}>+</button>
      <table>
        <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Valor</th>
            <th>Opções</th>
        </tr>
        {
          data.map(item =>{
            return (
              <tr key={item.id} className={styles.lines}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.value}</td>
                <td>
                  <button onClick={() => openEditModal(item.id)} className={styles.btnEdit} >editar</button>
                  <button onClick={() => hadleRemove(item)} className={styles.btnRemove}>Remover</button>
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setIsOpen(false)}
                    style={customStyles}
                    contentLabel="Example Modal"
                  >
                    <h1 className={styles.modalTitle}> Editar </h1>
                    <form onSubmit={handleSubmit(onEdit)} className={styles.modalForm}>
                      <label>Id: </label>
                      <input defaultValue={item.id} {...register("id")} value={item.id}/>
                      <label>Nome: </label>
                      <input defaultValue={item.name} {...register("name")} />
                      <label>Categoria: </label>
                      <select defaultValue={item.category} {...register("category")}>
                        <option value="internet"> internet </option>
                        <option value="tv"> tv </option>
                        <option value="celular"> celular </option>
                        <option value="fixo"> fixo </option>
                      </select>
                      <label>Valor: </label>
                      <input defaultValue={item.value} {...register("value")} />
                      <input type="submit" value="Editar" className={styles.btnEdit}/>
                      <button type="button" onClick={() => setIsOpen(false)} className={styles.btnRemove}>Cancelar</button>
                    </form>
                  </Modal>
                </td>
              </tr>
            )
          })
        }
    </table>
      <Modal
        isOpen={modalIsOpenCreate}
        onRequestClose={() => setIsOpenCreate(false)}
        style={customStyles}
      >
        <h1 className={styles.modalTitle} > Criar </h1>
        <form onSubmit={handleSubmit(onCreate)} className={styles.modalForm}>
          <label>Nome: </label>
          <input  {...register("name")} />
          <label>Categoria: </label>
          <select {...register("category")}>
            <option value="internet"> internet </option>
            <option value="tv"> tv </option>
            <option value="celular"> celular </option>
            <option value="fixo"> fixo </option>
          </select>
          <label>Valor: </label>
          <input {...register("value")} />
          <input type="submit" value="Criar" className={styles.btnEdit}/>
          <button type="button" onClick={() => setIsOpenCreate(false)} className={styles.btnRemove}>Cancelar</button>
        </form>
      </Modal>
    </div>
  )
}
