import { RiCloseLine } from "react-icons/ri"
import LoadingSpinner from "../../assets/spinner"
import { IoSearch } from "react-icons/io5";

function ProductsModal({
    handleClose,
    showAddProducts,
    searchTerm,
    handleSearchChange,
    productsArr,
    handleAdd,
    handleProductChange,
    handleVariantChange,
    selectedProducts,
    selectedVariants,
    scrollableRef,
    handleScroll,
    productsLoading,
    handleCancel
}) {
    return (
        showAddProducts &&
        <div className="modal-container">
            <div className="modal">
                <div className="modal-header">
                    <h4>Select Products</h4>
                    <RiCloseLine
                        onClick={() => handleClose()}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                {/* <LoadingSpinner /> */}
                <div className="search-bar">
                    <IoSearch className="search-bar__icon" />
                    <input
                        className="search-input"
                        type="text"
                        name="searchTerm"
                        value={searchTerm}
                        placeholder="Search Product"
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="modal-list scrollable" ref={scrollableRef} onScroll={handleScroll}>
                    {
                        productsLoading ?
                            <LoadingSpinner />
                            :
                            productsArr?.map((product) => {
                                return (
                                    <div className="product-select-container" key={product.id}>
                                        <div className="product-select-wrapper">
                                            <input
                                                type="checkbox"
                                                name={product?.id}
                                                onChange={(e) => handleProductChange(e, product)}
                                                checked={
                                                    selectedProducts?.indexOf(product) !== -1 &&
                                                    selectedVariants?.[product?.id]?.length > 0
                                                }
                                            />
                                            <img src={product?.image?.src} className="product-image" />
                                            <div className="product-name">{product?.title}</div>
                                        </div>
                                        {product?.variants?.map((variant) => {
                                            return (
                                                <div className="variant-select-wrapper" key={variant.id}>
                                                    <div className="variant-name">
                                                        <input
                                                            type="checkbox"
                                                            name={variant?.id}
                                                            checked={selectedVariants?.[product?.id]?.some(item => item.id === variant?.id)}
                                                            onChange={(e) => handleVariantChange(e, variant, product)}
                                                        />
                                                        <span>{variant?.title}</span>
                                                    </div>
                                                    <div className="variant-price">{variant?.price}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                </div>
                <div className="modal-footer">
                    <p> {selectedProducts?.length} Product Selected</p>
                    <div className="modal-footer__button-wrapper">
                        <button
                            className="button button--outlined"
                            onClick={handleCancel}
                        >Cancel</button>
                        <button
                            className="button button--green"
                            onClick={handleAdd}
                            disabled={selectedProducts?.length === 0}
                        >Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProductsModal