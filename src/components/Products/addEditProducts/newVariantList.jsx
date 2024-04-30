import { Draggable, Droppable } from "react-beautiful-dnd"
import { IoChevronDownOutline } from "react-icons/io5"
import { LuGripVertical } from "react-icons/lu"
import { RiCloseLine } from "react-icons/ri"

const NewVariantList = (
    {
        product,
        removeVariant,
        productIndex
    }
) => {
    return (
        <Droppable droppableId={`variant-container-${productIndex}`} type={product?.id}>
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {product?.variants?.length > 0 &&
                        (product?.variants?.length === 1 || product?.showVariant) &&
                        product?.variants?.map((variant, vIndex) => (
                            <Draggable
                                draggableId={`variant-${variant?.id}`}
                                index={vIndex}
                                key={variant.id}
                            >
                                {(provided) => (
                                    <div className="variant-wrapper"
                                        key={vIndex}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                        id={`variant-${variant?.id}`}>
                                        <LuGripVertical className="grip-icon-2" />
                                        <div className="custom-input-variant">
                                            {variant?.title ? variant?.title : 'Select Product'}
                                        </div>
                                        <div className="input-wrapper has-border-radius">
                                            <input type="text" name="discount" id="" className="input" />
                                            <select name="" className="select">
                                                <option value="">% Off <IoChevronDownOutline /></option>
                                                <option value="">flat <IoChevronDownOutline /></option>
                                            </select>
                                            {product?.variants?.length > 1 &&
                                                <RiCloseLine
                                                    onClick={() => removeVariant(product.id, variant.id)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            }
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    )
}
export default NewVariantList