"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChefHat, Download, LogOut } from "lucide-react";
import { Delivery, Food, Vote } from "@/types";
import DeliveryManager from "@/components/admin/DeliveryManager";
import FoodManager from "@/components/admin/FoodManager";
import DailyMenu from "@/components/admin/DailyMenu";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      router.push("/");
      return;
    }

    const savedDeliveries = localStorage.getItem("deliveries");
    const savedFoods = localStorage.getItem("foods");
    const savedVotes = localStorage.getItem("votes");

    setDeliveries(savedDeliveries ? JSON.parse(savedDeliveries) : []);
    setFoods(savedFoods ? JSON.parse(savedFoods) : []);
    setVotes(savedVotes ? JSON.parse(savedVotes) : []);
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("deliveries", JSON.stringify(deliveries));
    }
  }, [deliveries, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("foods", JSON.stringify(foods));
    }
  }, [foods, isLoading]);

  const addDelivery = (name: string) => {
    setDeliveries([...deliveries, { id: Date.now().toString(), name }]);
  };

  const deleteDelivery = (id: string) => {
    setDeliveries(deliveries.filter(d => d.id !== id));
    setFoods(foods.filter(f => f.deliveryId !== id));
  };

  const addFood = (name: string, deliveryId: string) => {
    setFoods([...foods, {
      id: Date.now().toString(),
      name,
      deliveryId,
      isAvailableToday: true
    }]);
  };

  const deleteFood = (id: string) => {
    setFoods(foods.filter(f => f.id !== id));
    setVotes(votes.filter(v => v.foodId !== id));
  };

  const toggleFoodAvailability = (foodId: string) => {
    setFoods(foods.map(food => 
      food.id === foodId ? { ...food, isAvailableToday: !food.isAvailableToday } : food
    ));
  };

  const clearDailyVotes = () => {
    const today = new Date().toISOString().split('T')[0];
    const newVotes = votes.filter(v => v.date !== today);
    setVotes(newVotes);
    localStorage.setItem("votes", JSON.stringify(newVotes));
  };

  const exportResults = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayVotes = votes.filter(v => v.date === today);
    
    const results = foods
      .filter(food => food.isAvailableToday)
      .map(food => {
        const delivery = deliveries.find(d => d.id === food.deliveryId);
        const foodVotes = todayVotes.filter(v => v.foodId === food.id);
        const details = foodVotes.map(vote => 
          `  - Additional requests: ${vote.additionalRequests || "None"}`
        ).join("\n");
        
        return `[${delivery?.name}] ${food.name} (${foodVotes.length} orders):\n${details}`;
      })
      .join("\n\n");

    const blob = new Blob([results], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `food-orders-${today}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearDailyVotes}>
              Clear Today's Votes
            </Button>
            {votes.length > 0 && (
              <Button variant="outline" onClick={exportResults}>
                <Download className="mr-2 h-4 w-4" />
                Export Results
              </Button>
            )}
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <DeliveryManager
          deliveries={deliveries}
          onAddDelivery={addDelivery}
          onDeleteDelivery={deleteDelivery}
        />
        <FoodManager
          foods={foods}
          deliveries={deliveries}
          onAddFood={addFood}
          onDeleteFood={deleteFood}
        />
        <DailyMenu
          foods={foods}
          deliveries={deliveries}
          onToggleFood={toggleFoodAvailability}
        />
      </div>
    </div>
  );
}