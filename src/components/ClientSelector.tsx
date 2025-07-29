import React, { useState, useEffect, useCallback } from 'react';
import { useClients, ClientData } from '@/hooks/useClients';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClientSelectorProps {
  value: string;
  onChange: (clientName: string, clientData?: Partial<ClientData>) => void;
  onClientDataChange?: (clientData: Partial<ClientData>) => void;
  clientPhone?: string;
  clientPhone2?: string;
  clientWhatsapp?: string;
  clientWhatsapp2?: string;
  clientEmail?: string;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  value,
  onChange,
  onClientDataChange,
  clientPhone = '',
  clientPhone2 = '',
  clientWhatsapp = '',
  clientWhatsapp2 = '',
  clientEmail = ''
}) => {
  const { getClientSuggestions, getClientByName, saveClient } = useClients();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<ClientData[]>([]);

  // Update search value when value prop changes
  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  // Update suggestions when search value changes
  useEffect(() => {
    if (searchValue.length > 0) {
      setSuggestions(getClientSuggestions(searchValue));
    } else {
      setSuggestions([]);
    }
  }, [searchValue, getClientSuggestions]);

  // Handle client selection
  const handleClientSelect = (clientName: string) => {
    const client = getClientByName(clientName);
    setSearchValue(clientName);
    onChange(clientName, client);
    
    if (client && onClientDataChange) {
      onClientDataChange({
        phone: client.phone,
        phone2: client.phone2,
        whatsapp: client.whatsapp,
        whatsapp2: client.whatsapp2,
        email: client.email
      });
    }
    
    setOpen(false);
  };

  // Handle input change
  const handleInputChange = (newValue: string) => {
    setSearchValue(newValue);
    onChange(newValue);
  };

  // Save client data when form is submitted - memoized to prevent recreations
  const handleSaveClientData = useCallback(() => {
    if (value.trim()) {
      saveClient({
        name: value.trim(),
        phone: clientPhone || undefined,
        phone2: clientPhone2 || undefined,
        whatsapp: clientWhatsapp || undefined,
        whatsapp2: clientWhatsapp2 || undefined,
        email: clientEmail || undefined
      });
    }
  }, [value, clientPhone, clientPhone2, clientWhatsapp, clientWhatsapp2, clientEmail, saveClient]);

  // Auto-save when any client data changes - debounced to prevent excessive saves
  useEffect(() => {
    if (!value.trim()) return;
    
    const timeoutId = setTimeout(() => {
      if (clientPhone || clientPhone2 || clientWhatsapp || clientWhatsapp2 || clientEmail) {
        const existingClient = getClientByName(value);
        if (existingClient) {
          // Only save if data has changed
          const hasChanges = 
            existingClient.phone !== (clientPhone || undefined) ||
            existingClient.phone2 !== (clientPhone2 || undefined) ||
            existingClient.whatsapp !== (clientWhatsapp || undefined) ||
            existingClient.whatsapp2 !== (clientWhatsapp2 || undefined) ||
            existingClient.email !== (clientEmail || undefined);
          
          if (hasChanges) {
            handleSaveClientData();
          }
        }
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [value, clientPhone, clientPhone2, clientWhatsapp, clientWhatsapp2, clientEmail, getClientByName]);

  return (
    <div className="space-y-2">
      <Label htmlFor="clientName" className="text-base font-semibold mb-2 block">שם הלקוח *</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-12 text-base border-2 border-blue-200/50 focus:border-blue-400/60"
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className={cn("truncate", !value && "text-muted-foreground")}>
                {value || "הכנס או בחר שם לקוח..."}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="חפש לקוח קיים או הקלד שם חדש..."
              value={searchValue}
              onValueChange={handleInputChange}
              dir="rtl"
            />
            <CommandList>
              {suggestions.length === 0 && searchValue.length > 0 && (
                <CommandEmpty>
                  <div className="text-center p-4">
                    <User className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      לא נמצאו לקוחות קיימים
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      הלקוח החדש יישמר אוטומטית
                    </p>
                  </div>
                </CommandEmpty>
              )}
              {suggestions.length > 0 && (
                <CommandGroup heading="לקוחות קיימים">
                  {suggestions.map((client) => (
                    <CommandItem
                      key={client.id}
                      onSelect={() => handleClientSelect(client.name)}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          value === client.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{client.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {client.phone && `טל: ${client.phone}`}
                          {client.email && ` • ${client.email}`}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};