import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {CheckIcon} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";

interface Props{
    form:any;
    data:{
        value:string;
        label:string;
    }[]
    name:string;
    label:string;
    title:string;
    placeholder:string;
    extraClass?:string;
}

const BaseAutoComplete=({form,data,name,label,title,placeholder,extraClass}:Props)=>{
    return(
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{label}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !field.value && "text-muted-foreground",extraClass
                                    )}
                                >
                                    {field.value
                                        ? data.find(
                                            (el) => el.value === field.value
                                        )?.label
                                        : title}
                                    {/*<CaretS className="ml-2 h-4 w-4 shrink-0 opacity-50" />*/}
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput
                                    placeholder={placeholder}
                                    className="h-9"
                                />
                                <ScrollArea className={'h-96'}>
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup>
                                    {data.map((el) => (
                                        <CommandItem
                                            value={el.label}
                                            key={el.value}
                                            onSelect={() => {
                                                form.setValue(name, el.value)
                                            }}
                                        >
                                            {el.label}
                                            <CheckIcon
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    el.value === field.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                                </ScrollArea>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
export default BaseAutoComplete;
