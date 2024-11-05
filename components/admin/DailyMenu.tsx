"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Delivery, Food } from "@/types";

interface DailyMenuProps {
  foods: Food[];
  deliveries: Delivery[];
  onToggleFood: (foodId: string) => void;
}

export default function DailyMenu({
  foods,
  deliveries,
  onToggleFood,
}: DailyMenuProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Menu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {deliveries.map((delivery) => {
            const deliveryFoods = foods.filter(
              (food) => food.deliveryId === delivery.id
            );
            if (deliveryFoods.length === 0) return null;

            return (
              <div key={delivery.id}>
                <h3 className="font-semibold mb-2">{delivery.name}</h3>
                <div className="grid gap-2">
                  {deliveryFoods.map((food) => (
                    <div
                      key={food.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={food.id}
                        checked={food.isAvailableToday}
                        onCheckedChange={() => onToggleFood(food.id)}
                      />
                      <label
                        htmlFor={food.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {food.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}