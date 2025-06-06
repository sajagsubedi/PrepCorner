"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { X } from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";
import { TestResult } from "@/types/testResult";
import { Button } from "@/components/ui/button";

const TestResultsComponent = () => {
  const router = useRouter();
  const { id } = useParams();
  const [stats, setStats] = useState({
    totalQuestions: 15,
    attempted: 0,
    correct: 0,
    incorrect: 0,
    accuracy: 0.0,
    percentage: 0.0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse<TestResult>>(
          `/api/mocktests/${id}/result`
        );
        const statsData = response.data.data;
        if (response.data.success && statsData) {
          setStats({
            totalQuestions: statsData.totalQuestions || 15,
            attempted: statsData.attempted || 0,
            correct: statsData.correct || 0,
            incorrect: statsData.incorrect || 0,
            accuracy: statsData.accuracy || 0.0,
            percentage: statsData.percentage || 0.0,
          });
        } else {
          router.back();
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStats();
    } else {
      setLoading(false);
      setError("No test ID provided");
    }
  }, [id, router]);

  const handleClose = () => {
    router.push("../");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-2xl font-semibold text-gray-700 animate-pulse">
          Loading Results...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="p-6 bg-white rounded-lg">
          <p className="text-xl font-semibold text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col p-6 relative">
      <div className="w-full max-w-4xl mx-auto rounded-2xl p-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Test Result
        </h1>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Statistics Card */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Your Score
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 flex items-center justify-center bg-blue-100 rounded-full border-4 border-blue-200">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-blue-600">
                      {stats.correct}/{stats.totalQuestions}
                    </span>
                    <p className="text-sm text-gray-500">Marks</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                  <span>{stats.attempted} Attempted</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span>{stats.correct} Correct</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span>{stats.incorrect} Incorrect</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics Card */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Performance Metrics
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">Accuracy</span>
                </div>
                <span className="font-medium text-blue-600">
                  {stats.accuracy.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">Percentage</span>
                </div>
                <span className="font-medium text-green-600">
                  {stats.percentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={() => router.push(`./result/solutions`)} size="lg">
            View Solutions
          </Button>
          <Button
            onClick={() => router.push(`/mocktests/${id}/practice`)}
            variant="outline"
            size="lg"
          >
            Practice Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResultsComponent;
