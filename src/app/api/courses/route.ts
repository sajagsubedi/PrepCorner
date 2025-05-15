import { authOptions } from "@/lib/auth";
import connectDb from "@/lib/connectDb";
import CourseModel from "@/models/course.model";
import { EnrollmentRequestStatus } from "@/models/enrollmentRequest.model";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDb();
  const session = await getServerSession(authOptions);
  const user = session?.user as User | null;

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const userId = new mongoose.Types.ObjectId(user._id);
    const result = await CourseModel.aggregate([
      {
        $match: {
          isVisible: true,
        },
      },
      {
        $lookup: {
          from: "enrollments",
          let: { courseId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$course", "$$courseId"],
                    },
                    {
                      $eq: ["$user", userId],
                    },
                  ],
                },
              },
            },
          ],
          as: "enrollment",
        },
      },
      {
        $lookup: {
          from: "enrollmentrequests",
          let: { courseId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$course", "$$courseId"],
                    },
                    {
                      $eq: ["$user", userId],
                    },
                  ],
                },
              },
            },
            { $sort: { requestedAt: -1 } }, // latest request first
            { $limit: 1 },
          ],
          as: "latestRequest",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "courseId",
          as: "categories",
        },
      },
      {
        $addFields: {
          enrollmentStatus: {
            $cond: {
              if: {
                $gt: [{ $size: "$enrollment" }, 0],
              },
              then: "enrolled",
              else: {
                $cond: {
                  if: {
                    $gt: [{ $size: "$latestRequest" }, 0],
                  },
                  then: {
                    $arrayElemAt: ["$latestRequest.status", 0],
                  },
                  else: "not_requested",
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          date: {
            $cond: {
              if: {
                $eq: ["$enrollmentStatus", EnrollmentRequestStatus.PENDING],
              },
              then: {
                $arrayElemAt: ["$latestRequest.requestedAt", 0],
              },
              else: {
                $cond: {
                  if: {
                    $eq: [
                      "$enrollmentStatus",
                      EnrollmentRequestStatus.REJECTED,
                    ],
                  },
                  then: {
                    $arrayElemAt: ["$latestRequest.updatedAt", 0],
                  },
                  else: {
                    $cond: {
                      if: {
                        $eq: ["$enrollmentStatus", "enrolled"],
                      },
                      then: {
                        $arrayElemAt: ["$enrollment.enrolledAt", 0],
                      },
                      else: null,
                    },
                  },
                },
              },
            },
          },
          categoriesCount: {
            $size: "$categories",
          },
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          image: 1,
          isVisible: 1,
          enrollmentStatus: 1,
          date: 1,
          categoriesCount: 1,
        },
      },
    ]);
    console.log(result);

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Courses fetched successfully!",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch courses" },
      {
        status: 500,
      }
    );
  }
}
