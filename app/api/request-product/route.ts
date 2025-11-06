/*eslint-disable*/
import { NextRequest, NextResponse } from "next/server";
import { apiClientUser } from "@/lib/interceptor";

// TypeScript interfaces for the request payload
interface ProductImage {
  url: string;
  altText?: string;
  isPrimary: boolean;
}

interface ProductRequestPayload {
  name: string;
  description: string;
  images: ProductImage[];
  category: string; // ObjectId string
  subCategory: string; // ObjectId string
  phone: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check Content-Type to determine how to parse the request
    const contentType = request.headers.get('content-type') || '';

    let body: ProductRequestPayload;

    if (contentType.includes('application/json')) {
      // Parse as JSON
      body = await request.json();
    } else if (contentType.includes('multipart/form-data')) {
      // Handle FormData (legacy support or if files are still being sent)
      const formData = await request.formData();

      // Extract form fields with new field names
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const category = formData.get("category") as string;
      const subCategory = formData.get("subCategory") as string;
      const phone = formData.get("phone") as string;

      // Parse images from form data (expecting JSON string)
      const imagesData = formData.get("images") as string;
      let images: ProductImage[] = [];
      if (imagesData) {
        try {
          images = JSON.parse(imagesData);
        } catch (e) {
          console.error("Error parsing images JSON:", e);
          return NextResponse.json(
            { error: "Invalid images JSON format" },
            { status: 400 }
          );
        }
      }

      body = { name, description, images, category, subCategory, phone };
    } else {
      return NextResponse.json(
        { error: "Content-Type must be application/json or multipart/form-data" },
        { status: 400 }
      );
    }

    // Extract fields from parsed body
    const { name, description, images, category, subCategory, phone } = body;

    // Validate required fields
    if (!name || !description || !images || !category || !subCategory || !phone) {
      return NextResponse.json(
        { error: "All fields are required: name, description, images, category, subCategory, phone" },
        { status: 400 }
      );
    }

    // Validate images array
    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "Images must be a non-empty array" },
        { status: 400 }
      );
    }

    // Validate each image object
    for (const image of images) {
      if (!image.url || typeof image.isPrimary !== 'boolean') {
        return NextResponse.json(
          { error: "Each image must have a url and isPrimary boolean field" },
          { status: 400 }
        );
      }
    }

    // Validate phone number (numeric only)
    if (!/^[0-9]+$/.test(phone)) {
      return NextResponse.json(
        { error: "Phone number must be numeric" },
        { status: 400 }
      );
    }

    // Validate category and subCategory are non-empty strings (ObjectIds)
    if (!category.trim() || !subCategory.trim()) {
      return NextResponse.json(
        { error: "Category and subCategory must be valid ObjectId strings" },
        { status: 400 }
      );
    }

    // Forward the request to the backend API
    console.log("Attempting to forward request to backend:", {
      endpoint: '/product-requests/create',
      payload: body
    });

    const response = await apiClientUser.post('/product-requests/create', body);

    console.log("Product request forwarded to backend successfully:", {
      name,
      description,
      imageCount: images.length,
      category,
      subCategory,
      phone,
      responseStatus: response?.status
    });

    return NextResponse.json(
      { message: "Product request submitted successfully", data: response },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error processing product request:", {
      error,
      message: error?.message,
      response: error?.response,
      status: error?.response?.status,
      data: error?.response?.data
    });

    // Handle specific API errors
    if (error?.response?.data?.message) {
      return NextResponse.json(
        { error: error.response.data.message },
        { status: error.response.status || 500 }
      );
    }

    // Handle network/auth errors
    if (error?.message) {
      return NextResponse.json(
        { error: `Request failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error - check server logs for details" },
      { status: 500 }
    );
  }
}
