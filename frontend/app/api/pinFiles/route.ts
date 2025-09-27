import { NextRequest, NextResponse } from 'next/server';
import { PinataSDK } from 'pinata';

const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
    pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL!,
});

export async function POST(request: NextRequest) {
    try {
        console.log('PinFiles API called');
        
        // Check if Pinata credentials are configured
        if (!process.env.NEXT_PUBLIC_PINATA_JWT || !process.env.NEXT_PUBLIC_GATEWAY_URL) {
            console.error('Missing Pinata credentials:', {
                hasJWT: !!process.env.NEXT_PUBLIC_PINATA_JWT,
                hasGateway: !!process.env.NEXT_PUBLIC_GATEWAY_URL,
                jwtLength: process.env.NEXT_PUBLIC_PINATA_JWT?.length || 0,
                gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL
            });
            return NextResponse.json(
                { error: 'IPFS service not configured. Please check environment variables.' },
                { status: 500 }
            );
        }
        
        console.log('Pinata credentials found, proceeding with upload...');

        const formData = await request.formData();
        const mainFile = formData.get('mainFile') as File;
        const artworkFile = formData.get('artworkFile') as File | null;
        const title = formData.get('title') as string;

        console.log('Form data received:', {
            hasMainFile: !!mainFile,
            hasArtworkFile: !!artworkFile,
            title: title,
            mainFileSize: mainFile?.size,
            mainFileType: mainFile?.type
        });

        if (!mainFile || !title) {
            console.error('Missing required fields:', { mainFile: !!mainFile, title: !!title });
            return NextResponse.json(
                { error: 'Main file and title are required' },
                { status: 400 }
            );
        }

        const results: string[] = [];

        // Upload main file
        const mainFileName = `${title}_main${mainFile.name.substring(
            mainFile.name.lastIndexOf('.')
        )}`;
        const mainFileToUpload = new File([mainFile], mainFileName, {
            type: mainFile.type,
        });

        console.log('Uploading main file to Pinata:', {
            fileName: mainFileName,
            fileSize: mainFileToUpload.size,
            fileType: mainFileToUpload.type
        });

        const mainUpload = await pinata.upload.public.file(mainFileToUpload);
        console.log('Main file uploaded successfully:', mainUpload.cid);
        results.push(mainUpload.cid);

        // Upload artwork if provided
        if (artworkFile) {
            const artworkFileName = `${title}_cover${artworkFile.name.substring(
                artworkFile.name.lastIndexOf('.')
            )}`;
            const artworkFileToUpload = new File([artworkFile], artworkFileName, {
                type: artworkFile.type,
            });

            const artworkUpload = await pinata.upload.public.file(artworkFileToUpload);
            results.push(artworkUpload.cid);
        }

        return NextResponse.json({ cids: results });
    } catch (error) {
        console.error('Error uploading files to Pinata:', {
            error: error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
        return NextResponse.json(
            { 
                error: 'Failed to upload files to IPFS',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
