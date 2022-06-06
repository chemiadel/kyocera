import S3 from 'react-aws-s3';

const config = {
    bucketName: 'kyocera-files',
    region: 'eu-central-1',
    accessKeyId: 'AKIASZILYM5KSCTHMDSN',
    secretAccessKey: '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',
};

export const ReactS3Client = new S3(config);