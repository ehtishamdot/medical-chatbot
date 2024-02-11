import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {ScrollArea} from "@/components/ui/scroll-area";
import {CheckIcon} from "lucide-react";

interface Props{
    form:any;
    countries:{
        name:{
            common:string;
        }
    }[]
    name:string;
    label:string;
    extraClass?:string;
}

const CountrySelect=({form,countries,name,label,extraClass}:Props)=>{
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
                                        ? countries.find(
                                            (country) => country.name.common === field.value
                                        )?.name.common
                                        : "Select Country"}
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command>
                                <CommandInput
                                    placeholder="Search Country..."
                                    className="h-9"
                                />
                                <ScrollArea className={'h-96'}>
                                    <CommandEmpty>No Country found.</CommandEmpty>
                                    <CommandGroup>
                                        {countries.map((country) => (
                                            <CommandItem
                                                value={country.name.common}
                                                key={country.name.common}
                                                onSelect={() => {
                                                    form.setValue(name, country.name.common)
                                                }}
                                            >
                                                {country.name.common}
                                                <CheckIcon
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        country.name.common === field.value
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
export default CountrySelect
