"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Delivery, Food } from "@/types";
import { Trash2 } from "lucide-react";

interface FoodManagerProps {
  foods: Food[];
  deliveries: Delivery[];
  onAddFood: (name: string, deliveryId: string) => void;
  onDeleteFood: (id: string) => void;
}

export default function FoodManager({
  foods,
  deliveries,
  onAddFood,
  onDeleteFood,
}: FoodManagerProps) {
  const [newFoodName, setNewFoodName] = useState("");
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string>("");

  const handleAddFood = () => {
    if (newFoodName.trim() && selectedDeliveryId) {
      onAddFood(newFoodName.trim(), selectedDeliveryId);
      setNewFoodName("");
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Manage Foods</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New food name"
              value={newFoodName}
              onChange={(e) => setNewFoodName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddFood()}
            />
            <Select
              value={selectedDeliveryId}
              onValueChange={setSelectedDeliveryId}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select delivery" />
              </SelectTrigger>
              <SelectContent>
                {deliveries.map((delivery) => (
                  <SelectItem key={delivery.id} value={delivery.id}>
                    {delivery.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddFood}>Add</Button>
          </div>
          <div className="grid gap-2">
            {foods.map((food) => {
              const delivery = deliveries.find((d) => d.id === food.deliveryId);
              return (
                <div
                  key={food.id}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
                  <div>
                    <span className="font-medium">{food.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({delivery?.name})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteFood(food.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}