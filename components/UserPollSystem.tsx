"use client";

import { useEffect, useState } from "react";
import { ChefHat } from "lucide-react";
import { Delivery, Food, Vote } from "@/types";
import FoodVoteCard from "@/components/FoodVoteCard";
import { Button } from "./ui/button";
import AdminLoginDialog from "./admin/AdminLoginDialog";
import { useRouter } from "next/navigation";

export default function UserPollSystem() {
  const router = useRouter();
  const [userId] = useState("user1"); // In production, this would come from auth
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    const savedDeliveries = localStorage.getItem("deliveries");
    const savedFoods = localStorage.getItem("foods");
    const savedVotes = localStorage.getItem("votes");

    setDeliveries(savedDeliveries ? JSON.parse(savedDeliveries) : []);
    setFoods(savedFoods ? JSON.parse(savedFoods) : []);
    setVotes(savedVotes ? JSON.parse(savedVotes) : []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("votes", JSON.stringify(votes));
    }
  }, [votes, isLoading]);

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

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      router.push('/admin');
    }
    setShowAdminLogin(false);
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
          <Button variant="outline" onClick={() => setShowAdminLogin(true)}>
            Admin Login
          </Button>
        </div>

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
      <AdminLoginDialog open={showAdminLogin} onOpenChange={setShowAdminLogin} onLogin={handleAdminLogin} />
    </div>
  );
}