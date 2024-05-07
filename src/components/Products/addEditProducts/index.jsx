import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import _ from "underscore"

import { getProducts } from "../../../redux/actions/productActions"

import { getProductsError, getProductsLoading, getSelectedProducts } from "../../../redux/slices/productSlice"

import ProductsModal from "./productsModal"
import NewProductList from "./newProductList"

export default function AddEditProducts() {

    const dispatch = useDispatch()

    const products = useSelector(getSelectedProducts)
    const productsLoading = useSelector(getProductsLoading)
    const productsError = useSelector(getProductsError)

    const [search, setSearch] = useState('')
    const [showAddProducts, setShowAddProducts] = useState(false)
    const [addedProductsArr, setAddedProductsArr] = useState([{ showDiscount: true }])
    const [productsArr, setProductsArr] = useState(products)
    const [indexToInsert, setIndexToInsert] = useState('')
    const [selectedProducts, setSelectedProducts] = useState([])
    const [selectedVariants, setSelectedVariants] = useState({})
    const [updatedVariants, setUpdatedVariants] = useState({})
    const [page, setPage] = useState(1)

    useEffect(() => {
        if (search || page) {
            dispatch(getProducts({ searchTerm: search, page: page }))
        }
    }, [search, page])

    useEffect(() => {
        if (products && products.length > 0 && !productsError && !productsLoading) {
            if (page === 1 && showAddProducts) {
                setProductsArr(products)
                const modalListScrollable = document.querySelector('.modal-list.scrollable');
                modalListScrollable.scrollTop = 0;
            } else if (page > 1) {
                setProductsArr(prevProducts => [...prevProducts, ...products])
            }
        }
    }, [products, page, showAddProducts])

    useEffect(() => {
        if (showAddProducts) {
            const modalListScrollable = document.querySelector('.modal-list.scrollable')
            const handleScroll = () => {
                if (
                    modalListScrollable.clientHeight + modalListScrollable.scrollTop + 10 >=
                    modalListScrollable.scrollHeight && products?.length === 10
                ) {
                    setPage((prev) => prev + 1)
                }
            }
            modalListScrollable.addEventListener('scroll', handleScroll)
            return () => modalListScrollable.removeEventListener('scroll', handleScroll)
        }
    }, [showAddProducts, products?.length, page]);


    const handleProductChange = (e, product) => {
        if (e.target.checked) {
            let requiredValue = [...selectedProducts, product]
            setSelectedProducts(_.uniq(requiredValue, item => item.id))
            setSelectedVariants(prevVariants => ({
                ...prevVariants,
                [product.id]: product?.variants
            }))
        } else {
            setSelectedProducts(selectedProducts.filter(item => item.id !== product.id))
            const updateObj = { ...selectedVariants }
            if (updateObj?.hasOwnProperty(product?.id)) {
                delete updateObj[product?.id]
                setSelectedVariants(updateObj)
            }
        }
    }

    const handleVariantChange = (e, variant, product) => {
        if (e.target.checked) {
            if (selectedProducts.findIndex(p => p.id === product.id) === -1) {
                setSelectedProducts(prevProducts => [...prevProducts, product])
            }
            setSelectedVariants(prevVariants => ({
                ...prevVariants,
                [product.id]: [
                    ...(prevVariants[product.id] || []),
                    variant
                ]
            }))
        } else {
            setSelectedVariants(prevVariants => {
                const updatedVariants = {
                    ...prevVariants,
                    [product.id]: (prevVariants[product.id] || []).filter(v => v.id !== variant.id)
                }
                if (updatedVariants[product.id].length === 0) {
                    setSelectedProducts(prevProducts => prevProducts.filter(p => p.id !== product.id))
                }
                return updatedVariants
            })
        }
    }

    const handleAdd = () => {
        const newArr = [...addedProductsArr]
        newArr.splice(indexToInsert, 1, selectedProducts?.map(product => {
            return {
                ...product,
                showDiscount: true,
                showVariant: false,
                'variants': selectedVariants[product?.id] || []
            }
        }))
        setAddedProductsArr(newArr?.flatMap(e => e))
        handleClose()
    }

    const handleClose = () => {
        setShowAddProducts(false)
        setSelectedProducts([])
        setUpdatedVariants({ ...updatedVariants, ...selectedVariants })
        setSelectedVariants({})
        setSearch('')
    }

    const addNewProduct = () => {
        const result = [...addedProductsArr]
        result.push({ showDiscount: true })
        setAddedProductsArr(result)
    }

    const removeProduct = (ind, productId) => {
        const result = [...addedProductsArr]
        result.splice(ind, 1)
        setAddedProductsArr(result)
        const updateObj = { ...updatedVariants }
        if (updateObj?.hasOwnProperty(productId)) {
            delete updateObj[productId]
            setUpdatedVariants(updateObj)
        }
    }

    const removeVariant = (productId, variantId) => {
        const updatedProducts = addedProductsArr.map(product => {
            if (product.id === productId) {
                product.variants = product.variants.filter(variant => variant.id !== variantId)
                setUpdatedVariants(prevVariants => ({
                    ...prevVariants,
                    [product.id]: prevVariants[product.id]?.filter(v => v.id !== variantId)
                }))
            }
            return product
        })
        setAddedProductsArr(updatedProducts)
    }

    const handleNotShowDiscount = (ind) => {
        setAddedProductsArr((prevProducts) =>
            prevProducts.map((prevProduct, i) =>
                i === ind ? { ...prevProduct, showDiscount: false } : prevProduct
            )
        )
    }
    const handleShowVariant = (ind) => {
        setAddedProductsArr((prevProducts) =>
            prevProducts.map((prevProduct, i) =>
                i === ind ? { ...prevProduct, showVariant: !prevProduct?.showVariant } : prevProduct
            )
        )
    }
    const handleSearchChange = (e) => {
        setPage(1)
        setSearch(e.target.value)
    }

    const handleOpen = (index) => {
        setIndexToInsert(index)
        setShowAddProducts(true)
    }

    const handleCancel = () => {
        setSearch('')
        setSelectedProducts([])
        setSelectedVariants({})
        handleClose()
    }

    return (
        <div className="products-container">
            <h4 className="title">Add Products</h4>
            <div className="list-container" id="list-container">
                <div className="list-headers">
                    <h5 className="sub-title">Product</h5>
                    <h5 className="sub-title">Discount</h5>
                </div>
                <NewProductList
                    addedProductsArr={addedProductsArr}
                    setAddedProductsArr={setAddedProductsArr}
                    handleOpen={handleOpen}
                    handleNotShowDiscount={handleNotShowDiscount}
                    removeProduct={removeProduct}
                    handleShowVariant={handleShowVariant}
                    removeVariant={removeVariant}
                    updatedVariants={updatedVariants}
                    setUpdatedVariants={setUpdatedVariants}
                />
            </div>
            <div className="flex--end">
                <button
                    className="button button--green-outline"
                    onClick={addNewProduct}>
                    Add Product
                </button>
            </div>
            <ProductsModal
                products={products}
                showAddProducts={showAddProducts}
                handleClose={handleClose}
                handleSearchChange={handleSearchChange}
                searchTerm={search}
                productsArr={productsArr}
                productsLoading={productsLoading}
                productsError={productsError}
                handleAdd={handleAdd}
                handleProductChange={handleProductChange}
                handleVariantChange={handleVariantChange}
                selectedProducts={selectedProducts}
                selectedVariants={selectedVariants}
                handleCancel={handleCancel}
                page={page}
            />
        </div>
    )
}