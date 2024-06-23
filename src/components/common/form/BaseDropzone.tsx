import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
    FieldValues,
    useController,
    UseControllerProps,
} from "react-hook-form";
import {toast} from "sonner";
import Image from "next/image";
type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
    [Property in Key]-?: Type[Property];
};
import {FileText} from "lucide-react";
type Props<T extends FieldValues> = {
    name: string;
    productId?: string;
    multiple: boolean;
    maxFiles: number;
    media?: string[]; // New prop to specify the maximum number of files allowed
    placeholder:string;
} & WithRequiredProperty<UseControllerProps<T>, "control">;

const BaseDropzone = <T extends FieldValues>({
                                                 control,
                                                 productId,
                                                 name,
                                                 multiple,
                                                 maxFiles,
                                                 media,
    placeholder,
                                                 rules = {},
                                             }: Props<T>) => {
    const {
        field: { onChange: fieldOnChange, value },
        // fieldState: { error },
    } = useController<T>({ name, control, rules });


    const [openModal, setOpenModal] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const handleRemoveFile = useCallback(
        (indexToRemove: number) => {
            if (value[indexToRemove] && media?.includes(value[indexToRemove])) {

            }
            const updatedFiles = (Array.isArray(value) ? value : []).filter(
                (_, index) => index !== indexToRemove
            );
            fieldOnChange(updatedFiles);
            setOpenModal(false);
        },
        [fieldOnChange, value]
    );

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (multiple) {
                const existingFiles: File[] = Array.isArray(value) ? value : [];
                const remainingSlots = maxFiles - existingFiles.length;
                if (remainingSlots > 0) {
                    const newFiles = acceptedFiles.filter(
                        (file) =>
                            !existingFiles.some(
                                (existingFile) => existingFile.name === file.name
                            )
                    );

                    // Ensure that we don't exceed the remaining slots when adding new files
                    const filesToAdd = newFiles.slice(
                        0,
                        Math.min(remainingSlots, newFiles.length)
                    );

                    const combinedFiles = [...existingFiles, ...filesToAdd];
                    fieldOnChange(combinedFiles);
                    console.log(combinedFiles);
                    combinedFiles.map((e, index) => {
                        const imageSize = e.size / (1024 * 1024);
                        if (imageSize > 3) {
                            toast.error("Image Size Can't be exceeded than 3 MB");
                            handleRemoveFile(index);
                        }
                    });
                } else {
                    toast.error(`Max ${maxFiles} Files Are Allowed`);
                }
            } else if (acceptedFiles.length > 0) {
                fieldOnChange(acceptedFiles[0]);
            }
        },
        [fieldOnChange, maxFiles, multiple, value]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple,
        maxFiles, // Specify the max number of files that can be dropped
    });
    return (
        <>
            <div                                     className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                                                     {...getRootProps()}>
                <input
                    {...getInputProps()}
                    type="file"
                    name={name}
                    multiple={multiple}
                    accept="image/*"
                    className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                />
                {isDragActive ? (
                    <p className="text-blue-600">Drop the file(s) here ...</p>
                ) : (
                    <>
                        {(!value || (Array.isArray(value) && value.length === 0)) && (
                            <div className="flex flex-col items-center justify-center space-y-3">
                <span
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                              fill="#3C50E0"
                          />
                          <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                              fill="#3C50E0"
                          />
                          <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                              fill="#3C50E0"
                          />
                        </svg>
                      </span>
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <p>
                                        <span className="text-primary">Click to upload</span>
                                    </p>
                                    <p className="mt-1.5">{placeholder??"Upload Your Patient Details In CSV Format"}</p>

                                </div>
                            </div>
                        )}
                    </>
                )}
                <div>
                    <div className="flex  items-center justify-center">
                        {value &&
                            Array.isArray(value) &&
                            value.length > 0 &&
                            value.map((e: File, index: number) => {
                                return (
                                    <div
                                        key={index}
                                        className="m-auto items-center flex justify-center relative"
                                        {...getRootProps({
                                            onClick: (event) => event.stopPropagation(),
                                        })}
                                    >
                                        <div className={"flex flex-col justify-center items-center"}>
                                            <FileText/>
                                            {e.name}
                                        </div>
                                        <span
                                            onClick={() => {
                                                setSelectedIndex(index);
                                                setOpenModal(true);
                                            }}
                                            className="absolute top-0 right-0 cursor-pointer"
                                        >
                    </span>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BaseDropzone;
