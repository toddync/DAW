import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Welcome to the admin dashboard. Please select a section from the sidebar to get started.</p>
      </CardContent>
    </Card>
  );
}
