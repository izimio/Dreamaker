import { FC } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box, Heading } from "@chakra-ui/react";
import { ethers } from "ethers";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface GraphProps {
    graph: {
        date: string;
        amount: string;
        funder: string;
    }[];
}

const calcTotalAmountUntil = (amount: string[], index: number) => {
    let totalAmount = 0n;
    for (let i = 0; i <= index; i++) {
        totalAmount += BigInt(amount[i]);
    }
    return totalAmount.toString();
};
const Graph: FC<GraphProps> = ({ graph }) => {
    const totalAmountGraph = graph.map((_, idx) =>
        calcTotalAmountUntil(
            graph.map((d) => d.amount),
            idx
        )
    );

    const chartData = {
        labels: graph.map((d) => new Date(d.date).toLocaleDateString()) || [],
        datasets: [
            {
                label: "Funded amount",
                data: totalAmountGraph.map((d) => ethers.formatEther(d)),
                borderColor: "hsl(180, 100%, 30%)",
                backgroundColor: "hsla(180, 100%, 30%, 0.5)",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (ctx: any) =>
                        `${graph[ctx.dataIndex].funder} - ${ethers.formatEther(graph[ctx.dataIndex].amount)} ETH`,
                },
            },
        },
    };

    return <Line options={options} data={chartData} />;
};

export default Graph;
