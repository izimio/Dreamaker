import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import Slider from "react-slick";
import { IDream } from "../providers/global";
import DreamCard from "./DreamCard";

import rocket from "/rocket.png";
import hot from "/timeout.png";
import { defaultBoostedDream, defaultHotDream } from "../utils/filler";

const settings = {
    infinite: true,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 4000,
    slidesToShow: 3,
    slidesToScroll: 1,
    pauseOnHover: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                infinite: true,
                autoplay: true,
                speed: 500,
                autoplaySpeed: 2000,
                slidesToShow: 2,
                slidesToScroll: 1,
                pauseOnHover: true,
            },
        },
        {
            breakpoint: 600,
            settings: {
                infinite: true,
                autoplay: true,
                speed: 500,
                autoplaySpeed: 2000,
                slidesToShow: 1,
                slidesToScroll: 1,
                pauseOnHover: true,
            },
        },
    ],
};

interface CarouselProps {
    cards: IDream[];
    type?: "boost" | "hot" | "default";
}

export default function Carousel({ cards, type }: CarouselProps) {
    const slider = React.useRef<any>();

    const defaultCard =
        type === "boost" ? defaultBoostedDream : defaultHotDream;
    if (cards.length < 3) {
        for (let i = 0; i < 3 - cards.length; i++) {
            cards.push(defaultCard);
        }
    }
    return (
        <Box position={"relative"}>
            {type !== "default" && (
                <>
                    <Image
                        src={type === "boost" ? rocket : hot}
                        alt={"rocket"}
                        width={"75px"}
                        position={"absolute"}
                        top={"30px"}
                        right={"-20px"}
                        zIndex={5}
                        animation={"wiggleSpin 10s infinite ease"}
                    />

                    <Image
                        src={type === "boost" ? rocket : hot}
                        alt={"rocket"}
                        width={"75px"}
                        position={"absolute"}
                        top={"30px"}
                        style={{
                            transform: "scaleX(-1)",
                        }}
                        left={"-20px"}
                        zIndex={5}
                        animation={"rwiggleSpin 10s infinite ease"}
                    />
                </>
            )}
            <Text
                fontSize={"3xl"}
                fontWeight={"bold"}
                mb={"1em"}
                textAlign={"center"}
                textTransform={"uppercase"}
                bgGradient={
                    type === "boost"
                        ? "linear(to-bl, light, federalBlue)"
                        : "linear(to-br, red, orange, red)"
                }
                bgClip="text"
                textShadow="3px 3px 0px rgba(0,0,0,0.1)"
            >
                {type === "boost"
                    ? "Boosted dreams"
                    : type === "hot"
                      ? "Hot dreams"
                      : "Dreams"}
            </Text>
            <Box
                position={"relative"}
                width={"full"}
                py={5}
                boxShadow={
                    type === "boost"
                        ? "0px 0px 120px rgba(0, 139, 139, 0.8)"
                        : "0px 0px 120px rgba(255, 0, 0, 0.8)"
                }
                bgGradient={
                    type === "boost"
                        ? "linear(to-b, rgba(0, 200, 200, 0.5), rgba(0, 139, 139, 0.5))"
                        : "linear(to-b, rgba(255, 0, 0, 0.5), rgba(255, 80, 0, 0.5))"
                }
                rounded={"lg"}
            >
                <Slider {...settings} ref={(c) => (slider.current = c)}>
                    {cards.map((card, index) => (
                        <Flex key={index} width={"full"} zIndex={1}>
                            <DreamCard key={index} dream={card} />
                        </Flex>
                    ))}
                </Slider>
            </Box>
        </Box>
    );
}
