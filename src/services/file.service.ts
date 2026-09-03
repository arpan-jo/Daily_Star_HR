// file.service.ts for file download using ReactNativeBlobUtil
// get fileUrl from getImageURL function
// set file path for android and ios using react-native-fs
// Created By: Ibnul Hayat, Date: 2026-03-03

import { PermissionsAndroid, Platform } from "react-native";
import RNFS from 'react-native-fs';
import { getImageURL } from "../common/services/getImage";
import { DownloadProps, DownloadResponse } from "../types/file.types";


class FileService {

    async checkStoragePermission(): Promise<boolean> {
        if (Platform.OS === 'android' && Platform.Version < 33) {
            const checkStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
            if (!checkStatus) {
                const requestStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)

                return requestStatus === PermissionsAndroid.RESULTS.GRANTED
            }

            return checkStatus
        }
        return true
    }


    async FileDownload(props: DownloadProps): Promise<DownloadResponse> {

        const isStoragePermission = await this.checkStoragePermission()

        if (isStoragePermission) {

            const fileUrl = props?.fullUrl ? props?.fullUrl : getImageURL(props?.fileId);


            const directoryPath = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath
                : RNFS.DownloadDirectoryPath;
            const filepPath = directoryPath + '/' + props?.fileName;

            const headers = props?.token ? { Authorization: `Bearer ${props.token}` } : undefined;

            try {
                
                const download = RNFS.downloadFile({
                    fromUrl: fileUrl,
                    toFile: filepPath,
                    background: true,
                    discretionary: true,
                    headers: headers,
                });

                const result = await download.promise;

                if (result.statusCode === 200) {

                    return Object.assign({
                        status: true,
                        message: 'Download completed successfully.'
                    })
                } else {
                    return Object.assign({
                        status: false,
                        message: 'Download failed, Please try again.'
                    })
                }
            } catch (_error) {
                // console.error("downloadFile error => ",error)
                return Object.assign({
                    status: false,
                    message: 'Download failed, Please try again.'
                })
            }

        }

        return Object.assign({
            status: false,
            message: 'Storage permission denied.'
        })
    }

}
export const fileService = new FileService()