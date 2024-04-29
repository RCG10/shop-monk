import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { Product } from "./product";

const ProductList = ({
    setAddedProductsArr,
    addedProductsArr,
    removeProduct,
    handleNotShowDiscount,
    handleOpen,
    handleShowVariant,
    removeVariant
}) => {
    const getPostion = (id) => {
        return addedProductsArr?.findIndex(item => item?.id === id)
    }

    const handleDragEnd = (e) => {
        const { active, over } = e
        if (active?.id !== over.id) {
            setAddedProductsArr(addedProductsArr => {
                const originalPos = getPostion(active?.id)
                const updatedPos = getPostion(over?.id)
                return arrayMove(addedProductsArr, originalPos, updatedPos)
            }
            )
        }
    }

    return (
        <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={addedProductsArr} strategy={verticalListSortingStrategy}>
                {addedProductsArr.map((product, index) => (
                    <Product
                        key={index}
                        id={product?.id}
                        index={index}
                        newProduct={product}
                        removeProduct={removeProduct}
                        handleNotShowDiscount={handleNotShowDiscount}
                        handleOpen={handleOpen}
                        removeVariant={removeVariant}
                        handleShowVariant={handleShowVariant} />
                ))}
            </SortableContext>
        </DndContext>
    );
};

export default ProductList;
