"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Delivery } from "@/types";
import { Trash2 } from "lucide-react";

interface DeliveryManagerProps {
  deliveries: Delivery[];
  onAddDelivery: (name: string) => void;
  onDeleteDelivery: (id: string) => void;
}

export default function DeliveryManager({
  deliveries,
  onAddDelivery,
  onDeleteDelivery,
}: DeliveryManagerProps) {
  const [newDeliveryName, setNewDeliveryName] = useState("");

  const handleAddDelivery = () => {
    if (newDeliveryName.trim()) {
      onAddDelivery(newDeliveryName.trim());
      setNewDeliveryName("");
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Manage Deliveries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New delivery name"
              value={newDeliveryName}
              onChange={(e) => setNewDeliveryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddDelivery()}
            />
            <Button onClick={handleAddDelivery}>Add</Button>
          </div>
          <div className="grid gap-2">
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <span>{delivery.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteDelivery(delivery.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}