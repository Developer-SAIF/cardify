"use client";

import type { Control, UseFieldArrayReturn, FieldValues, Path } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, PlusCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DynamicListItem {
  id: string;
  [key: string]: any; 
}

interface FieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder: string;
  type?: string;
}

interface DynamicListEditorProps<TItem extends DynamicListItem, TFormValues extends FieldValues> {
  fieldArray: UseFieldArrayReturn<TFormValues, any, "id">;
  control: Control<TFormValues>;
  listName: string; // e.g. "skills", "links", "education"
  itemTitleKey: keyof TItem; // Key to use for item title (e.g. "name" for skills, "platform" for links)
  generateNewItem: () => TItem;
  fieldsConfig: FieldConfig<TItem>[]; // Configuration for input fields within each item
  itemClassName?: string;
}

export function DynamicListEditor<TItem extends DynamicListItem, TFormValues extends FieldValues>({
  fieldArray,
  control,
  listName,
  itemTitleKey,
  generateNewItem,
  fieldsConfig,
  itemClassName
}: DynamicListEditorProps<TItem, TFormValues>) {
  const { fields, append, remove, update } = fieldArray;

  return (
    <div className="space-y-4 w-full">
      {fields.map((item, index) => (
        <Card key={item.id} className={cn("overflow-hidden shadow-md w-full", itemClassName)}>
          <CardContent className="p-2 sm:p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h4 className="font-semibold text-foreground break-words">
                {(item as any)[itemTitleKey as string] || `${listName.slice(0, -1)} ${index + 1}`}
              </h4>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => update(index, { ...(item as any), isVisible: !(item as any).isVisible } as any)}
                  title={(item as any).isVisible ? "Hide" : "Show"}
                >
                  {(item as any).isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {fieldsConfig.map(fieldConf => (
              <div key={String(fieldConf.name)} className="space-y-1 w-full">
                <Label htmlFor={`${listName}.${index}.${String(fieldConf.name)}`}>{fieldConf.label}</Label>
                <Input
                  id={`${listName}.${index}.${String(fieldConf.name)}`}
                  // @ts-ignore
                  {...control.register(`${listName}.${index}.${String(fieldConf.name)}`)}
                  placeholder={fieldConf.placeholder}
                  type={fieldConf.type || "text"}
                  className="text-sm w-full"
                />
              </div>
            ))}
            
            {/* Hidden input for isVisible, managed by the eye button */}
             <Input type="hidden"  {...control.register(`${listName}.${index}.isVisible` as any)} />
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append(generateNewItem() as any, { shouldFocus: false })}
        className="w-full border-dashed hover:border-solid"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add {listName.slice(0, -1)}
      </Button>
    </div>
  );
}
