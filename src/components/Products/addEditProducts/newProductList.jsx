import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { HiPencil } from "react-icons/hi2";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { LuGripVertical } from "react-icons/lu";
import { RiCloseLine } from "react-icons/ri";
import NewVariantList from "./newVariantList";
import { useState } from "react";

const ProductList = ({
    addedProductsArr,
    setAddedProductsArr,
    handleOpen,
    handleNotShowDiscount,
    removeProduct,
    handleShowVariant,
    removeVariant,
    updatedVariants,
    setUpdatedVariants
}) => {
    const handleDragDrop = (results) => {
        const { source, destination, type } = results;
        if (!destination) return;
        if (type === 'product') {
            if (source?.droppableId === destination?.droppableId &&
                source.index === destination.index) return;
            const reOrderedProducts = [...addedProductsArr];
            const sourceIndex = source.index;
            const destinationIndex = destination.index;
            const [removedProduct] = reOrderedProducts.splice(sourceIndex, 1)
            reOrderedProducts?.splice(destinationIndex, 0, removedProduct)
            return setAddedProductsArr(reOrderedProducts)
        } else {
            const requiredObj = { ...updatedVariants }
            let productId = results?.type
            const reOrderedProducts = [...updatedVariants[productId]];
            const sourceIndex = source.index;
            const destinationIndex = destination.index;
            const [removedProduct] = reOrderedProducts.splice(sourceIndex, 1)
            reOrderedProducts?.splice(destinationIndex, 0, removedProduct)
            requiredObj[productId] = reOrderedProducts
            setUpdatedVariants(requiredObj)
            let resultProducts = addedProductsArr?.map(product => {
                if (product?.id === productId) {
                    return {
                        ...product,
                        'variants': requiredObj[product.id]
                    }
                } else {
                    return product
                }
            })
            return setAddedProductsArr(resultProducts)
        }
    }

    return (
        <DragDropContext onDragEnd={handleDragDrop}>
            <Droppable droppableId="list-container" type="product">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {addedProductsArr.map((product, index) => (
                            <Draggable
                                draggableId={`draggable-${index}`}
                                index={index}
                                key={index}
                            >
                                {(provided) => (
                                    <div
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                        id={`draggable-${index}`}
                                        className="product-container"
                                    >
                                        <div className="product-wrapper">
                                            <LuGripVertical className="grip-icon" />
                                            {index + 1}.
                                            <div className="custom-input-wrapper">
                                                <input
                                                    type="text"
                                                    value={product?.title ? product?.title : 'Select Product'}
                                                />
                                                <button className="button custom-button">
                                                    <HiPencil onClick={() => handleOpen(index)} />
                                                </button>
                                            </div>
                                            {product?.showDiscount ?
                                                <div className="input-wrapper">
                                                    <button
                                                        className="button button--green-wide"
                                                        onClick={() => handleNotShowDiscount(index)}
                                                    >
                                                        Add Discount
                                                    </button>
                                                </div> :
                                                <div className="input-wrapper">
                                                    <input type="text" name="discount" id="" className="input" />
                                                    <select name="" className="select">
                                                        <option value="">% Off <IoChevronDownOutline /></option>
                                                        <option value="">flat <IoChevronDownOutline /></option>
                                                    </select>
                                                    {addedProductsArr?.length > 1 &&
                                                        <RiCloseLine
                                                            onClick={() => removeProduct(index,product.id)}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    }
                                                </div>
                                            }
                                        </div>
                                        {product?.variants?.length > 1 &&
                                            <div className="flex--end">
                                                <span
                                                    className="button button--link"
                                                    onClick={() => { handleShowVariant(index) }}
                                                >
                                                    {!product?.showVariant ?
                                                        <>
                                                            Show variants <IoChevronDownOutline />
                                                        </> :
                                                        <>
                                                            Hide variants <IoChevronUpOutline />
                                                        </>
                                                    }
                                                </span>
                                            </div>
                                        }
                                        <div id={`variant-container-${index}`}>
                                            <NewVariantList
                                                productIndex={index}
                                                product={product}
                                                removeVariant={removeVariant}
                                            />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default ProductList;
