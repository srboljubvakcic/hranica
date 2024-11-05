"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChefHat, Download } from "lucide-react";
import { Delivery, Food, Vote } from "@/types";
import DeliveryManager from "@/components/admin/DeliveryManager";
import FoodManager from "@/components/admin/FoodManager";
import DailyMenu from "@/components/admin/DailyMenu";
import FoodVoteCard from "@/components/FoodVoteCard";
import client from "edgedb"; // Import EdgeDB klijent

export default function FoodPollSystem() {
  const [isAdmin] = useState(true); // In production, this would come from auth
  const [userId] = useState("user1"); // In production, this would come from auth
  const [isLoading, setIsLoading] = useState(true);

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    const fetchDataFromDB = async () => {
      try {
        const response = await fetch('/api/fetchData');
        const data = await response.json();

        setDeliveries(data.deliveries);
        setFoods(data.foods);
        setVotes(data.votes);
      } catch (error) {
        console.error('Error fetching data from DB:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataFromDB();
  }, []);

  const saveDataToDB = async () => {
    try {
      await fetch('/api/saveData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveries,
          foods,
          votes,
        }),
      });
    } catch (error) {
      console.error('Error saving data to DB:', error);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      saveDataToDB();
    }
  }, [deliveries, foods, votes, isLoading]);

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

  const handleVote = (foodId: string, additionalRequests: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingVote = votes.find(v =>
      v.foodId === foodId && v.userId === userId && v.date === today
    );

    if (existingVote) {
      setVotes(votes.filter(v => v.id !== existingVote.id));
    } else {
      setVotes([...votes, {
        id: Date.now().toString(),
        foodId,
        userId,
        additionalRequests,
        date: today
      }]);
    }
  };

  const clearDailyVotes = () => {
    const today = new Date().toISOString().split('T')[0];
    setVotes(votes.filter(v => v.date !== today));
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
            <h1 className="text-3xl font-bold">Food Poll System</h1>
          </div>
          {isAdmin && (
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
            </div>
          )}
        </div>

        {isAdmin && (
          <>
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
          </>
        )}

        <div className="space-y-8">
          {deliveries.map((delivery) => {
            const deliveryFoods = foods.filter(
              food => food.deliveryId === delivery.id && food.isAvailableToday
            );
            if (deliveryFoods.length === 0) return null;

            return (
              <div key={delivery.id}>
                <h2 className="text-2xl font-semibold mb-4">{delivery.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deliveryFoods.map((food) => (
                    <FoodVoteCard
                      key={food.id}
                      food={food}
                      deliveryName={delivery.name}
                      votes={votes.filter(v =>
                        v.foodId === food.id &&
                        v.date === new Date().toISOString().split('T')[0]
                      )}
                      userId={userId}
                      onVote={handleVote}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
