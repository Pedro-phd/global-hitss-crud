import { toast } from 'react-toastify';
import axios from 'axios'

export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '500px'
  },
}

const handleUndoCreate = (item, setUndo, setValue) => {
  // handleCreate(item, setUndo, setValue)
  alert('Não tive tempo de terminar a feature :(')
}

export const handleSucess = (msg) =>{
  toast.success(msg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
}

export const handleUndo = (item, setUndo, setValue) =>{
  toast('🔄 Clique para desafazer !', {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    onClick: () => handleUndoCreate()
    });
}

export const handleError = (err) => {
  toast.error('Algo deu errado! Consulte os logs', {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
    })
  console.error(err)
}

export const hadleRemove = (item, setUndo, undo, setValue) => {
  axios.delete(`http://localhost:3000/products/${item.id}`)
  .then(() => handleSucess('Removido com sucesso!'))
  .catch(err => handleError(err))
  setUndo(item)
  handleUndo(undo, setUndo, setValue)
}
export const handleEdit = (item, setUndo, idToEdit, setIsOpen, setValue) => {
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

export const handleCreate = (item, setUndo, setValue) => {
  axios.post("http://localhost:3000/products/", {name: item.name, category: item.category, value: item.value})
  .then(() => handleSucess('Criado com sucesso!'))
  .catch(err => handleError(err))
  setUndo(item)
  setValue('id','')
  setValue('name','')
  setValue('category','')
  setValue('value','')
}