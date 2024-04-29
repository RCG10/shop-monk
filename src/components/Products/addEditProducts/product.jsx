import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HiPencil } from "react-icons/hi2";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { LuGripVertical } from "react-icons/lu";
import { RiCloseLine } from "react-icons/ri";

export const Product = (
    {
        key,
        id,
        index,
        newProduct,
        removeProduct,
        handleNotShowDiscount,
        handleOpen,
        removeVariant,
        handleShowVariant,
        addedProductsArr
    }
) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div className="product-container"
            ref={setNodeRef}
            style={style}
            key={key}
        >
            <div className="product-wrapper"
            >
                <LuGripVertical {...attributes}
                    {...listeners} className="grip-icon" />
                {index + 1}.
                <div class="custom-input-wrapper">
                    <input
                        type="text"
                        value={newProduct?.title ? newProduct?.title : 'Select Product'}
                    />
                    <button class="button custom-botton">
                        <HiPencil onClick={() => handleOpen(index)} />
                    </button>
                </div>
                {newProduct?.showDiscount ?
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
                                onClick={() => removeProduct(index)}
                                style={{ cursor: 'pointer' }}
                            />
                        }
                    </div>
                }
            </div>
            {newProduct?.variants?.length > 1 &&
                <div className="flex--end">
                    <span className="button button--link"
                        onClick={() => { handleShowVariant(index) }}
                    >
                        {!newProduct?.showVariant ?
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
            {newProduct?.variants?.length > 0 &&
                (newProduct?.variants?.length === 1 || newProduct?.showVariant) &&
                newProduct?.variants?.map((variant, vIndex) => {
                    return (
                        <div className="variant-wrapper">
                            <LuGripVertical className="grip-icon" />
                            <div class="custom-input-variant">
                                {variant?.title ? variant?.title : 'Select Product'}
                            </div>
                            <div className="input-wrapper has-border-radius">
                                <input type="text" name="discount" id="" className="input" />
                                <select name="" className="select">
                                    <option value="">% Off <IoChevronDownOutline /></option>
                                    <option value="">flat <IoChevronDownOutline /></option>
                                </select>
                                {newProduct?.variants?.length > 1 &&
                                    <RiCloseLine
                                        onClick={() => removeVariant(newProduct.id, variant.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
};