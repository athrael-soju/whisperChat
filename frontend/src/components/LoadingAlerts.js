import React from "react";
import { Spin, Typography } from "antd";

const { Title } = Typography;

const LoadingAlerts = ({ alert }) => {
  if (alert) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "white",
            }}
          >
            {alert?.message}
          </Title>
          {alert?.type !== "success" && <Spin size="large" />}
        </div>
        <Title
          level={2}
          size="large"
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          {alert?.description}
        </Title>
      </>
    );
  }

  return null;
};

export default LoadingAlerts;
