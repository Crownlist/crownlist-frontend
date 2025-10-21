/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import { apiClientUser } from '@/lib/interceptor';

export async function POST(request: NextRequest) {
  console.log('🔗 API Route: POST /api/chat/create called');

  try {
    const body = await request.json();
    console.log('🔗 API Route: Request body:', body);

    // Extract participants and product info
    const { participants, productId, productName } = body;

    if (!participants || !Array.isArray(participants) || participants.length < 2) {
      console.error('❌ API Route: Invalid participants:', participants);
      return NextResponse.json({
        success: false,
        error: 'Missing participants (need at least 2)'
      }, { status: 400 });
    }

    console.log('🔗 API Route: Creating chat with participants:', participants);

    // Forward to backend API
    const response = await apiClientUser.post('/chats', {
      participants,
      productId,
      productName
    });

    console.log('🔗 API Route: Backend response:', response);
    console.log('🔗 API Route: Backend response data:', response?.data);

    // Check response structure and extract chat ID
    const chatId = response?.data?.data?.data?._id || response?.data?.data?._id || response?.data?._id;

    if (!chatId) {
      console.error('❌ API Route: No chat ID in backend response');
      console.error('❌ API Route: Full response for debugging:', JSON.stringify(response?.data, null, 2));
      throw new Error('Chat ID not found in backend response');
    }

    console.log('✅ API Route: Chat created successfully with ID:', chatId);

    return NextResponse.json({
      success: true,
      message: 'Chat created successfully',
      data: {
        _id: chatId,
        participants: response?.data?.data?.data?.participants || participants,
        createdAt: response?.data?.data?.data?.createdAt || new Date().toISOString(),
      }
    });

  } catch (error: any) {
    console.error('❌ API Route: Error creating chat:', error);
    console.error('❌ API Route: Error response:', error?.response?.data);
    console.error('❌ API Route: Error message:', error?.message);

    return NextResponse.json({
      success: false,
      error: 'Failed to create chat',
      details: error?.response?.data || error?.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed. Use POST to create chats.'
  }, { status: 405 });
}
