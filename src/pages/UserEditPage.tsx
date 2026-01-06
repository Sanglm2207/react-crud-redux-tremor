import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Card, Title, Text, TextInput, NumberInput, Select, SelectItem, Button
} from "@tremor/react";
import { selectUsers, updateUser, fetchUsers } from "../store/users";
import { selectRoles, fetchRoles } from "../store/roles";
import { Save } from "lucide-react";
import AvatarUpload from "../components/ui/AvatarUpload";
import { toast } from "sonner";
import { Gender, User } from "../store/users/types";
import { useAppDispatch, useAppSelector } from "../store/store";

export default function UserEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { list: users } = useAppSelector(selectUsers);
    const roles = useAppSelector(selectRoles);

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        age: 0,
        gender: "OTHER" as Gender,
        address: "",
        phone: "",
        roleId: "",
        avatar: ""
    });

    // 1. Fetch data nếu chưa có
    useEffect(() => {
        dispatch(fetchRoles());
        if (users.length === 0) {
            dispatch(fetchUsers());
        }
    }, [dispatch, users.length]);

    // 2. Tìm User từ ID trên URL
    useEffect(() => {
        if (id && users.length > 0) {
            const found = users.find(u => String(u.id) === id);
            if (found) {
                setCurrentUser(found);
                setFormData({
                    name: found.name || "",
                    age: found.age || 0,
                    gender: found.gender || "OTHER",
                    address: found.address || "",
                    phone: found.phone || "",
                    roleId: found.role?.id ? String(found.role.id) : "",
                    avatar: found.avatar || ""
                });
            }
        }
    }, [id, users]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setIsSaving(true);
        try {
            await dispatch(updateUser({
                id: Number(id),
                name: formData.name,
                age: Number(formData.age),
                gender: formData.gender,
                address: formData.address,
                phone: formData.phone,
                avatar: formData.avatar,
                // Backend yêu cầu Role object, ta truyền { id: ... }
                role: formData.roleId ? { id: Number(formData.roleId) } : undefined
            })).unwrap();

            toast.success("Cập nhật thông tin thành công!");
            navigate("/settings/users"); // Quay lại danh sách
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật!");
        } finally {
            setIsSaving(false);
        }
    };

    if (!currentUser) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

    return (
        <div className="space-y-6">

            {/* --- FORM CONTENT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Avatar */}
                <Card className="col-span-1 h-fit">
                    <Title className="mb-4 text-center">Avatar</Title>
                    <AvatarUpload
                        currentImageUrl={formData.avatar}
                        onUploadSuccess={(url) => setFormData({ ...formData, avatar: url })}
                    />
                </Card>

                {/* Right Column: Form Fields */}
                <Card className="col-span-1 lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Text>Họ và tên</Text>
                                <TextInput
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <Text>Vai trò (Role)</Text>
                                <Select value={formData.roleId} onValueChange={(val) => setFormData({ ...formData, roleId: val })}>
                                    {roles.map(r => (
                                        <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Text>Tuổi</Text>
                                <NumberInput
                                    value={formData.age}
                                    onValueChange={(val) => setFormData({ ...formData, age: val })}
                                    min={0}
                                />
                            </div>

                            <div className="space-y-1">
                                <Text>Giới tính</Text>
                                <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val as Gender })}>
                                    <SelectItem value="MALE">Nam</SelectItem>
                                    <SelectItem value="FEMALE">Nữ</SelectItem>
                                    <SelectItem value="OTHER">Khác</SelectItem>
                                </Select>
                            </div>

                            <div className="space-y-1 md:col-span-2">
                                <Text>Số điện thoại</Text>
                                <TextInput
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1 md:col-span-2">
                                <Text>Địa chỉ</Text>
                                <TextInput
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t mt-6">
                            <Button type="submit" loading={isSaving} icon={Save}>
                                Lưu thay đổi
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}