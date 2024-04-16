import React, { FC } from "react";
import { Hero, Typography, Button } from "@web3uikit/core";

const HeroBanner: FC = () => {
    return (
        <Hero
            align="right"
            backgroundColor="#0F7FFF"
            customImage={{
                url: "static/media/wizard.5067270c.svg",
            }}
            height="200px"
            padding="40px"
            rounded="20px"
        >
            <React.Fragment key=".0">
                <Typography color="#FFFFFF" variant="h3">
                    Need Help?
                </Typography>
                <Typography color="#FFFFFF" variant="h1">
                    Looking to get started?
                </Typography>
                <Button
                    customize={{
                        backgroundColor: "transparent",
                        border: "1px solid white",
                        color: "#FFFFFF",
                    }}
                    iconLayout="trailing"
                    isTransparent
                    text="Book a demo"
                    theme="custom"
                />
            </React.Fragment>
        </Hero>
    );
};

export default HeroBanner;
