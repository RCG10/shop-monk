import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import _ from "underscore"

import { getProducts } from "../../../redux/actions/productActions"

import { getProductsError, getProductsLoading, getSelectedProducts } from "../../../redux/slices/productSlice"

import ProductList from "./productList"
import ProductsModal from "./productsModal"

export default function AddEditProducts() {

    const dispatch = useDispatch()

    const products = useSelector(getSelectedProducts)
    const productsLoading = useSelector(getProductsLoading)
    const productsError = useSelector(getProductsError)

    const scrollableRef = useRef(null);

    const [search, setSearch] = useState('')
    const [showAddProducts, setShowAddProducts] = useState(false)
    const [addedProductsArr, setAddedProductsArr] = useState([{ showDiscount: true }])
    const [productsArr, setProductsArr] = useState([])
    const [indexToInsert, setIndexToInsert] = useState('')
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (search && page) {
            dispatch(getProducts({ searchTerm: search, page: page }))
        }
    }, [search,page])

    useEffect(() => {
        if (!productsLoading && !productsError && search?.length > 0) {
            setProductsArr(products)
        }
    }, [productsLoading, productsError, search])

    const handleScroll = () => {
        const scrollable = scrollableRef.current;
        if (scrollable) {
            const { scrollTop, clientHeight, scrollHeight } = scrollable;
            if (scrollTop + clientHeight === scrollHeight) {
                dispatch(getProducts({ searchTerm: search, page: products.length / 10 + 1 }));
            }
        }
    };

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
    };

    const handleVariantChange = (e, variant, product) => {
        if (e.target.checked) {
            if (selectedProducts.findIndex(p => p.id === product.id) === -1) {
                setSelectedProducts(prevProducts => [...prevProducts, product]);
            }
            setSelectedVariants(prevVariants => ({
                ...prevVariants,
                [product.id]: [
                    ...(prevVariants[product.id] || []),
                    variant
                ]
            }));
        } else {
            setSelectedVariants(prevVariants => ({
                ...prevVariants,
                [product.id]: prevVariants[product.id]?.filter(v => v.id !== variant.id)
            }));
        }
    };

    const handleAdd = () => {
        const newArr = [...addedProductsArr];
        newArr.splice(indexToInsert, 1, selectedProducts?.map(product => {
            return {
                ...product,
                showDiscount: true,
                showVariant: false,
                'variants': selectedVariants[product?.id] || []
            }
        }));
        setAddedProductsArr(newArr?.flatMap(e => e))
        handleClose()
    };

    const handleClose = () => {
        setShowAddProducts(false)
        setProductsArr([])
        setSelectedProducts([])
        setSelectedVariants({})
        setSearch('')
    }
    const addNewProduct = () => {
        const result = [...addedProductsArr]
        result.push({ showDiscount: true })
        setAddedProductsArr(result)
    }
    const removeProduct = (ind) => {
        const result = [...addedProductsArr]
        result.splice(ind, 1)
        setAddedProductsArr(result)
    }

    const removeVariant = (productId, variantId) => {
        const updatedProducts = addedProductsArr.map(product => {
            if (product.id === productId) {
                product.variants = product.variants.filter(variant => variant.id !== variantId);
            }
            return product;
        });
        setAddedProductsArr(updatedProducts);
    };

    const handleNotShowDiscount = (ind) => {
        setAddedProductsArr((prevProducts) =>
            prevProducts.map((prevProduct, i) =>
                i === ind ? { ...prevProduct, showDiscount: false } : prevProduct
            )
        );
    }
    const handleShowVariant = (ind) => {
        setAddedProductsArr((prevProducts) =>
            prevProducts.map((prevProduct, i) =>
                i === ind ? { ...prevProduct, showVariant: !prevProduct?.showVariant } : prevProduct
            )
        );
    }
    const handleSearchChange = (e) => {
        setSearch(e.target.value)
        setPage(1);
        setProductsArr([])
    }

    const handleOpen = (index) => {
        setIndexToInsert(index)
        setShowAddProducts(true)
    }

    const handleCancel = () => {
        setSearch('')
        setPage('')
        setSelectedProducts([])
        setSelectedVariants({})
        handleClose()
    }

    return (
        <div className="products-container">
            <h4 className="title">Add Products</h4>
            <div className="list-container">
                <div className="list-headers">
                    <h5 className="sub-title">Product</h5>
                    <h5 className="sub-title">Discount</h5>
                </div>
                <ProductList
                    setAddedProductsArr={setAddedProductsArr}
                    addedProductsArr={addedProductsArr}
                    removeProduct={removeProduct}
                    handleNotShowDiscount={handleNotShowDiscount}
                    setShowAddProducts={setShowAddProducts}
                    handleOpen={handleOpen}
                    handleShowVariant={handleShowVariant}
                    removeVariant={removeVariant}
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
                scrollableRef={scrollableRef}
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
                handleScroll={handleScroll}
                handleCancel={handleCancel}
            />
        </div>
    )
}