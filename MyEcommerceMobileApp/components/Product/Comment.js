import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import React from 'react'
import Apis, { authApi, endpoints } from '../../configs/Apis';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Comment = ({ route }) => {
    const [content, setContent] = React.useState('');
    const [comment, setComment] = React.useState(null);
    const { productId } = route.params;

    React.useEffect(() => {
        const loadComment = async () => {
            let url = endpoints['comments'](productId);

            try {
                const res = await Apis.get(url);
                setComment(res.data);
            } catch (error) {
                console.error(error);
            }

        };

        loadComment();
    }, []);

    if (comment === null) {
        return <ActivityIndicator />;
    }

    const addCloudinaryDomain = (publicId) => {
        const cloudinaryDomain = 'res.cloudinary.com/dy4p98hhs/';
        return `https://${cloudinaryDomain}/${publicId}`;
    };

    const addComment = async() => {
        try {
            let accessToken = await AsyncStorage.getItem("access-token")
            const res = await authApi(accessToken).post(endpoints["add-comments"](productId), {
                "content": content,
            });
            setContent("");
            setComment([res.data, ...comment]);
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <View>
            <Text>Bình luận</Text>
            <View className="p-1">

                <TextInput value={content} onChangeText={(t) => setContent(t)}
                    className="border-2	border-slate-300 p-4"
                    placeholder="Nhập văn bản">
                </TextInput>

                <TouchableOpacity className="my-2 " style={{ width: 100, }} onPress={addComment}>
                    <Text className="bg-orange-400 p-4 ">Đánh giá</Text>
                </TouchableOpacity>
            </View>

            <View>
                {comment.length === 0 ? (
                    <Text className="text-center text-red-500 p-4 text-2xl">Chưa có đánh giá</Text>
                ) : (
                    comment.map((r) => (
                        <View className="border-b-2 pr-4 mr-2" >
                            <View key={r.id} className="flex-row p-4">
                                <Image
                                    source={{ uri: addCloudinaryDomain(r.user.avatar) }}
                                    style={{ width: 50, height: 50, borderRadius: 150 }}
                                />
                                <View className="ml-2">
                                    <Text className="ms-4">{r.user.username}</Text>
                                    <Text className="text-base">{r.content}</Text>
                                </View>
                            </View>
                        </View>
                    ))

                )}
            </View>
        </View>


    )
}

export default Comment